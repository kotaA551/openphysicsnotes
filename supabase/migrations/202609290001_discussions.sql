begin;
create schema if not exists discussion_private;
revoke all on schema discussion_private from public, anon, authenticated;
grant usage on schema discussion_private to service_role;

create table public.discussion_comments (
  id bigint generated always as identity primary key,
  article_kind text not null check (article_kind in ('chapters', 'curiosities')),
  article_slug text not null check (char_length(article_slug) between 1 and 160),
  content_locale text not null check (content_locale in ('en','fr','de','it','es','zh-CN','zh-TW','ja','ko')),
  section_id text not null check (char_length(section_id) between 1 and 1500),
  parent_id bigint,
  display_name text not null default '' check (char_length(display_name) <= 60),
  content text not null check (char_length(content) between 1 and 3000 and content ~ '[^[:space:]]'),
  created_at timestamptz not null default now(),
  status text not null default 'published' check (status in ('published','hidden')),
  unique (id, article_kind, article_slug, content_locale, section_id),
  foreign key (parent_id, article_kind, article_slug, content_locale, section_id)
    references public.discussion_comments (id, article_kind, article_slug, content_locale, section_id) on delete cascade
);
create index discussion_section_page on public.discussion_comments
  (article_kind, article_slug, content_locale, section_id, parent_id, id) where status = 'published';
create index discussion_parent on public.discussion_comments (parent_id);
alter table public.discussion_comments enable row level security;
revoke all on public.discussion_comments from public, anon, authenticated;
grant select, insert, update, delete on public.discussion_comments to service_role;
grant usage, select on sequence public.discussion_comments_id_seq to service_role;

create table discussion_private.limits (
  token text primary key check (token ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null default now(),
  window_count integer not null default 0,
  total_count integer not null default 0,
  last_post timestamptz,
  expires_at timestamptz not null default now() + interval '48 hours'
);
create table discussion_private.receipts (
  request_id uuid primary key,
  token text not null,
  fingerprint text not null,
  comment_id bigint not null references public.discussion_comments(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '48 hours'
);
create index discussion_receipt_duplicate on discussion_private.receipts (token, fingerprint, expires_at);
create index discussion_limit_expiry on discussion_private.limits (expires_at);
create index discussion_receipt_expiry on discussion_private.receipts (expires_at);
alter table discussion_private.limits enable row level security;
alter table discussion_private.receipts enable row level security;
revoke all on all tables in schema discussion_private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema discussion_private to service_role;

-- Also enforce one reply level for trusted/manual inserts.
create function discussion_private.check_parent() returns trigger language plpgsql
set search_path = '' as $$
begin
  if new.parent_id is not null and not exists (
    select 1 from public.discussion_comments p where p.id = new.parent_id and p.parent_id is null
      and p.status = 'published' and p.article_kind = new.article_kind and p.article_slug = new.article_slug
      and p.content_locale = new.content_locale and p.section_id = new.section_id
  ) then raise exception 'invalid_parent' using errcode = 'P0001'; end if;
  return new;
end $$;
create trigger discussion_parent_guard before insert or update of parent_id, article_kind, article_slug, content_locale, section_id
on public.discussion_comments for each row execute function discussion_private.check_parent();

create function discussion_private.public_comment(c public.discussion_comments) returns jsonb
language sql immutable set search_path = '' as $$
  select jsonb_build_object('id', c.id::text, 'parentId', c.parent_id::text,
    'displayName', c.display_name, 'content', c.content, 'createdAt', c.created_at)
$$;

create function public.discussion_read_gate(p_token text) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare r discussion_private.limits;
begin
  insert into discussion_private.limits(token) values(p_token) on conflict do nothing;
  select * into r from discussion_private.limits where token = p_token for update;
  if r.window_start <= now() - interval '1 minute' then
    r.window_start := now(); r.window_count := 0;
  end if;
  if r.window_count >= 120 then return false; end if;
  update discussion_private.limits set window_start = r.window_start, window_count = r.window_count + 1 where token = p_token;
  return true;
end $$;

create function public.discussion_counts(p_kind text, p_slug text, p_locale text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_object_agg(section_id, n), '{}'::jsonb) from (
    select c.section_id, count(*) as n from public.discussion_comments c
    left join public.discussion_comments p on p.id = c.parent_id
    where c.article_kind = p_kind and c.article_slug = p_slug and c.content_locale = p_locale
      and c.status = 'published' and (c.parent_id is null or p.status = 'published')
    group by c.section_id
  ) counts
$$;

-- Twenty roots at a time; each includes the first five replies. Replies have their own cursor.
create function public.discussion_list(p_kind text, p_slug text, p_locale text, p_section text,
  p_parent bigint default null, p_after bigint default 0) returns jsonb
language sql stable security invoker set search_path = '' as $$
  with candidates as (
    select c.* from public.discussion_comments c
    where c.article_kind = p_kind and c.article_slug = p_slug and c.content_locale = p_locale
      and c.section_id = p_section and c.parent_id is not distinct from p_parent and c.id > p_after
      and c.status = 'published'
      and (c.parent_id is null or exists (select 1 from public.discussion_comments p where p.id = c.parent_id and p.status = 'published'))
    order by c.id limit 21
  ), page as (select * from candidates order by id limit 20)
  select jsonb_build_object('hasMore', (select count(*) > 20 from candidates),
    'items', coalesce((select jsonb_agg(discussion_private.public_comment(c) || jsonb_build_object(
      'replyCount', (select count(*) from public.discussion_comments r where r.parent_id = c.id and r.status = 'published'),
      'replies', coalesce((select jsonb_agg(discussion_private.public_comment(r) order by r.id)
        from (select * from public.discussion_comments where parent_id = c.id and status = 'published' order by id limit 5) r), '[]'::jsonb)
    ) order by c.id) from page c), '[]'::jsonb))
$$;

create function public.discussion_post(p_kind text, p_slug text, p_locale text, p_section text,
  p_parent bigint, p_name text, p_content text, p_token text, p_fingerprint text, p_request uuid) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare r discussion_private.limits; receipt discussion_private.receipts; c public.discussion_comments;
begin
  if p_token !~ '^[a-f0-9]{64}$' or p_fingerprint !~ '^[a-f0-9]{64}$'
    or char_length(p_name) > 60 or char_length(p_content) not between 1 and 3000
    or p_content !~ '[^[:space:]]' then raise exception 'invalid_input'; end if;
  -- Serialize by pseudonymous visitor, including concurrent requests on different Vercel instances.
  insert into discussion_private.limits(token) values(p_token) on conflict do nothing;
  select * into r from discussion_private.limits where token = p_token for update;
  select * into receipt from discussion_private.receipts where request_id = p_request;
  if found then
    if receipt.token <> p_token or receipt.fingerprint <> p_fingerprint then raise exception 'duplicate'; end if;
    select * into c from public.discussion_comments where id = receipt.comment_id and status = 'published';
    if not found then raise exception 'invalid_parent'; end if;
    return jsonb_build_object('comment', discussion_private.public_comment(c), 'replayed', true);
  end if;
  if exists(select 1 from discussion_private.receipts where token = p_token and fingerprint = p_fingerprint
    and expires_at > now() + interval '48 hours' - interval '10 minutes') then raise exception 'duplicate'; end if;
  if r.window_start <= now() - interval '10 minutes' then r.window_start := now(); r.window_count := 0; end if;
  if r.last_post > now() - interval '15 seconds' or r.window_count >= 5 or r.total_count >= 30 then
    raise exception 'rate_limited';
  end if;
  if p_parent is not null then
    perform 1 from public.discussion_comments where id = p_parent and parent_id is null and status = 'published'
      and article_kind = p_kind and article_slug = p_slug and content_locale = p_locale and section_id = p_section for share;
    if not found then raise exception 'invalid_parent'; end if;
  end if;
  insert into public.discussion_comments(article_kind, article_slug, content_locale, section_id, parent_id, display_name, content)
    values(p_kind, p_slug, p_locale, p_section, p_parent, p_name, p_content) returning * into c;
  insert into discussion_private.receipts(request_id, token, fingerprint, comment_id) values(p_request, p_token, p_fingerprint, c.id);
  update discussion_private.limits set window_start = r.window_start, window_count = r.window_count + 1,
    total_count = r.total_count + 1, last_post = now() where token = p_token;
  return jsonb_build_object('comment', discussion_private.public_comment(c), 'replayed', false);
end $$;

create function public.discussion_cleanup() returns void language sql security invoker set search_path = '' as $$
  delete from discussion_private.receipts where expires_at <= now();
  delete from discussion_private.limits where expires_at <= now();
$$;

revoke all on all functions in schema discussion_private from public, anon, authenticated;
grant execute on all functions in schema discussion_private to service_role;
revoke all on function public.discussion_read_gate(text), public.discussion_counts(text,text,text),
  public.discussion_list(text,text,text,text,bigint,bigint), public.discussion_post(text,text,text,text,bigint,text,text,text,text,uuid),
  public.discussion_cleanup() from public, anon, authenticated;
grant execute on function public.discussion_read_gate(text), public.discussion_counts(text,text,text),
  public.discussion_list(text,text,text,text,bigint,bigint), public.discussion_post(text,text,text,text,bigint,text,text,text,text,uuid),
  public.discussion_cleanup() to service_role;
commit;
