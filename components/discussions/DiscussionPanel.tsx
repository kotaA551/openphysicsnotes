'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { localePath } from '@/lib/i18n';
import { CONTENT_LIMIT, NAME_LIMIT } from '@/lib/discussions/validation.mjs';
import { useDiscussion } from './DiscussionProvider';

type Comment = { id: string; parentId: string | null; displayName: string; content: string; createdAt: string };
type Thread = Comment & { replies: Comment[]; replyCount: number };
type Page = { items: Thread[]; hasMore: boolean };
const merge = <T extends Comment>(a: T[], b: T[]) => [...new Map([...a, ...b].map(c => [c.id, c])).values()].sort((x, y) => BigInt(x.id) < BigInt(y.id) ? -1 : 1);

function useErrorText() {
  const { t } = useDiscussion();
  return (code: string) => ({ invalid: t.invalid, duplicate: t.duplicate, rate_limited: t.rate, invalid_parent: t.parent, forbidden: t.unavailable, not_found: t.parent }[code] || t.unavailable);
}
async function fetchJSON(url: string, options?: RequestInit) {
  const response = await fetch(url, { ...options, cache: 'no-store', signal: AbortSignal.timeout(15000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'unavailable');
  return data;
}
function CommentForm({ sectionId, parentId = null, target, onPosted, onCancel }: {
  sectionId: string; parentId?: string | null; target?: string; onPosted: (comment: Comment) => void; onCancel?: () => void;
}) {
  const { scope, locale, t, refresh } = useDiscussion();
  const errorText = useErrorText();
  const id = useId();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const lock = useRef(false);
  const attempt = useRef({ value: '', id: '' });
  return <form className="discussion-form" onSubmit={async event => {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setPending(true); setError(''); setSuccess(false);
    const value = JSON.stringify([name, content, parentId]);
    if (attempt.current.value !== value) attempt.current = { value, id: crypto.randomUUID() };
    try {
      const data = await fetchJSON('/api/discussions', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scope, sectionId, displayName: name, content, website, parentId, requestId: attempt.current.id }) });
      onPosted(data.comment); setContent(''); setSuccess(true); attempt.current = { value: '', id: '' }; void refresh();
    } catch (err) { setError(errorText(err instanceof Error ? err.message : 'unavailable')); }
    finally { lock.current = false; setPending(false); }
  }}>
    {target && <p className="discussion-reply-target">{t.replying}: <bdi>{target}</bdi></p>}
    <div className="discussion-trap" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></div>
    <label htmlFor={`${id}-name`}>{t.name}</label>
    <input id={`${id}-name`} name="displayName" autoComplete="off" maxLength={NAME_LIMIT} value={name} onChange={e => setName(e.target.value)} disabled={pending}/>
    <label htmlFor={`${id}-comment`}>{t.comment}</label>
    <textarea id={`${id}-comment`} name="content" rows={4} maxLength={CONTENT_LIMIT} required value={content} onChange={e => setContent(e.target.value)} disabled={pending} aria-describedby={`${id}-note ${id}-status`}/>
    <div className="discussion-form-meta"><span>{content.length.toLocaleString(locale)} / {CONTENT_LIMIT.toLocaleString(locale)}</span></div>
    <p id={`${id}-note`} className="discussion-note">{t.note} <Link href={localePath(locale, '/privacy')}>{t.privacy}</Link></p>
    <div className="discussion-actions"><button className="discussion-post" type="submit" disabled={pending || !content.trim()}>{pending ? t.posting : t.post}</button>{onCancel && <button type="button" disabled={pending} onClick={onCancel}>{t.cancel}</button>}</div>
    <div id={`${id}-status`} aria-live="polite">{error && <p className="discussion-error" role="alert">{error}</p>}{success && <p className="discussion-note">{t.posted}</p>}</div>
  </form>;
}

function CommentBody({ comment, now, onReply }: { comment: Comment; now: number; onReply: () => void }) {
  const { t, locale } = useDiscussion();
  const date = new Date(comment.createdAt);
  const seconds = Math.min(0, Math.round((date.getTime() - now) / 1000));
  const [amount, unit]: [number, Intl.RelativeTimeFormatUnit] = Math.abs(seconds) < 60 ? [seconds, 'second'] : Math.abs(seconds) < 3600 ? [Math.round(seconds / 60), 'minute'] : Math.abs(seconds) < 86400 ? [Math.round(seconds / 3600), 'hour'] : [Math.round(seconds / 86400), 'day'];
  return <><div className="discussion-author"><bdi>{comment.displayName || t.anonymous}</bdi><time dateTime={comment.createdAt} title={date.toLocaleString(locale)}>{new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(amount, unit)}</time></div><p className="discussion-text" dir="auto">{comment.content}</p><button type="button" className="discussion-reply-button" onClick={onReply}>{t.reply}</button></>;
}

export default function DiscussionPanel({ sectionId }: { sectionId: string }) {
  const { scope, t } = useDiscussion();
  const errorText = useErrorText();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cursor, setCursor] = useState('');
  const [more, setMore] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [replyPages, setReplyPages] = useState<Record<string, { cursor: string; more: boolean }>>({});
  const [now, setNow] = useState(Date.now());
  const lock = useRef(false);
  const replyForm = useRef<HTMLDivElement>(null);
  const query = (extra: Record<string, string> = {}) => '/api/discussions?' + new URLSearchParams({ ...scope, sectionId, ...extra });
  async function load(reset = false) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try {
      const page: Page = await fetchJSON(query(!reset && cursor ? { after: cursor } : {}));
      setThreads(old => reset ? page.items : merge(old, page.items));
      setReplyPages(old => ({ ...(reset ? {} : old), ...Object.fromEntries(page.items.map(c => [c.id, { cursor: c.replies.at(-1)?.id || '', more: c.replyCount > c.replies.length }])) }));
      setCursor(page.items.at(-1)?.id || ''); setMore(page.hasMore); setReady(true);
    } catch (err) { setError(errorText(err instanceof Error ? err.message : 'unavailable')); }
    finally { lock.current = false; setBusy(false); }
  }
  useEffect(() => { void load(true); const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []); // Mounted only after this section is opened.
  useEffect(() => { if (replyTarget) replyForm.current?.querySelector('textarea')?.focus(); }, [replyTarget]);
  async function loadReplies(id: string) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try {
      const page: Page = await fetchJSON(query({ parentId: id, ...(replyPages[id]?.cursor ? { after: replyPages[id].cursor } : {}) }));
      setThreads(old => old.map(c => c.id === id ? { ...c, replies: merge(c.replies, page.items) } : c));
      setReplyPages(old => ({ ...old, [id]: { cursor: page.items.at(-1)?.id || '', more: page.hasMore } }));
    } catch (err) { setError(errorText(err instanceof Error ? err.message : 'unavailable')); }
    finally { lock.current = false; setBusy(false); }
  }
  return <div className="discussion-panel" aria-busy={busy}>
    {busy && <p role="status" className="discussion-note">{t.loading}</p>}
    {error && <p className="discussion-error" role="alert">{error} <button type="button" disabled={busy} onClick={() => void load(true)}>{t.retry}</button></p>}
    {ready && <>
      {threads.length === 0 && <p className="discussion-note">{t.empty}</p>}
      <ul className="discussion-comments">{threads.map(thread => <li key={thread.id}>
        <CommentBody comment={thread} now={now} onReply={() => setReplyTarget({ id: thread.id, name: thread.displayName || t.anonymous })}/>
        {thread.replies.length > 0 && <ul className="discussion-replies" aria-label={t.replies}>{thread.replies.map(reply => <li key={reply.id}><CommentBody comment={reply} now={now} onReply={() => setReplyTarget({ id: thread.id, name: thread.displayName || t.anonymous })}/></li>)}</ul>}
        {replyPages[thread.id]?.more && <button type="button" disabled={busy} onClick={() => void loadReplies(thread.id)}>{t.more} · {t.replies}</button>}
        {replyTarget?.id === thread.id && <div ref={replyForm}><CommentForm sectionId={sectionId} parentId={thread.id} target={replyTarget.name} onCancel={() => setReplyTarget(null)} onPosted={comment => {
          setThreads(old => old.map(c => c.id === thread.id ? { ...c, replies: merge(c.replies, [comment]), replyCount: c.replyCount + (c.replies.some(r => r.id === comment.id) ? 0 : 1) } : c));
          setNow(Date.now()); setReplyTarget(null);
        }}/></div>}
      </li>)}</ul>
      {more && <button type="button" disabled={busy} onClick={() => void load()}>{t.more}</button>}
      <CommentForm sectionId={sectionId} onPosted={comment => { setThreads(old => merge(old, [{ ...comment, replies: [], replyCount: 0 }])); setNow(Date.now()); }}/>
    </>}
  </div>;
}
