import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { randomUUID } from 'node:crypto';

test('PostgreSQL: scopes, threads, pagination, permissions, moderation, abuse controls', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(await fs.readFile('supabase/migrations/202609290001_discussions.sql', 'utf8'));
    const token = 'a'.repeat(64), fingerprint = 'b'.repeat(64);
    const post = async (overrides = {}) => {
      const p = { section: 'first', parent: null, content: '<script>alert(1)</script>', name: '', token, fingerprint, request: randomUUID(), ...overrides };
      return (await db.query('select public.discussion_post($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) as result',
        ['chapters', 'test', 'en', p.section, p.parent, p.name, p.content, p.token, p.fingerprint, p.request])).rows[0].result;
    };
    const page = async (section = 'first', parent = null, after = '0') => (await db.query('select public.discussion_list($1,$2,$3,$4,$5,$6) as result', ['chapters','test','en',section,parent,after])).rows[0].result;
    const request = randomUUID();
    const first = await post({ request });
    assert.equal(first.comment.displayName, '');
    assert.equal(first.comment.content, '<script>alert(1)</script>');
    assert.equal((await post({ request })).comment.id, first.comment.id, 'retries are idempotent');
    await assert.rejects(post(), /duplicate/);
    await assert.rejects(post({ fingerprint: 'c'.repeat(64), content: 'new' }), /rate_limited/);
    const reply = await post({ token: 'c'.repeat(64), parent: first.comment.id, content: 'Reply' });
    await assert.rejects(post({ token: 'd'.repeat(64), section: 'other', parent: first.comment.id }), /invalid_parent/);
    await assert.rejects(post({ token: 'd'.repeat(64), parent: reply.comment.id }), /invalid_parent/);
    assert.equal((await page()).items[0].replies[0].id, reply.comment.id);
    assert.equal((await page('other')).items.length, 0);
    const counts = (await db.query("select public.discussion_counts('chapters','test','en') as counts")).rows[0].counts;
    assert.equal(counts.first, 2);
    assert.deepEqual((await db.query("select public.discussion_counts('chapters','test','ja') as counts")).rows[0].counts, {});
    await db.exec("update public.discussion_comments set status = 'hidden' where parent_id is null");
    assert.equal((await page()).items.length, 0);
    assert.equal((await page('first', first.comment.id)).items.length, 0);
    await db.exec("update public.discussion_comments set status = 'published'");
    for (let i = 0; i < 25; i++) await db.query("insert into public.discussion_comments(article_kind,article_slug,content_locale,section_id,content) values ('chapters','test','en','first',$1)", ['Root ' + i]);
    const p1 = await page(), p2 = await page('first', null, p1.items.at(-1).id);
    assert.equal(p1.items.length, 20); assert.equal(p1.hasMore, true); assert.equal(p2.items.length, 6); assert.equal(p2.hasMore, false);
    assert.equal(new Set([...p1.items, ...p2.items].map(c => c.id)).size, 26);
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`set role ${role}`);
      await assert.rejects(db.query('select * from public.discussion_comments'), /permission denied/);
      await assert.rejects(db.query("select public.discussion_counts('chapters','test','en')"), /permission denied/);
      await assert.rejects(post({ token: 'e'.repeat(64) }), /permission denied/);
      await db.exec('reset role');
    }
    await db.exec('set role service_role');
    assert.equal((await page()).items.length, 20);
    await post({ token: 'e'.repeat(64) });
    await db.exec('reset role');
    // Per-visitor budgets are enforced by a locked row, not process memory.
    await db.query('update discussion_private.limits set last_post = now() - interval \'20 seconds\', window_count = 5 where token = $1', [token]);
    await assert.rejects(post({ fingerprint: 'f'.repeat(64) }), /rate_limited/);
    await db.query('update discussion_private.limits set window_start = now() - interval \'11 minutes\', total_count = 30 where token = $1', [token]);
    await assert.rejects(post({ fingerprint: 'f'.repeat(64) }), /rate_limited/);
    for (let i = 0; i < 120; i++) assert.equal((await db.query('select public.discussion_read_gate($1) as allowed', ['f'.repeat(64)])).rows[0].allowed, true);
    assert.equal((await db.query('select public.discussion_read_gate($1) as allowed', ['f'.repeat(64)])).rows[0].allowed, false);
    await db.query('delete from public.discussion_comments where id = $1', [first.comment.id]);
    assert.equal((await db.query('select * from public.discussion_comments where id = $1', [reply.comment.id])).rows.length, 0);
    await db.exec("update discussion_private.limits set expires_at = now() - interval '1 hour'; update discussion_private.receipts set expires_at = now() - interval '1 hour'; select public.discussion_cleanup();");
    assert.equal((await db.query('select count(*)::int as n from discussion_private.limits')).rows[0].n, 0);
    assert.equal((await db.query('select count(*)::int as n from discussion_private.receipts')).rows[0].n, 0);
  } finally { await db.close(); }
});
