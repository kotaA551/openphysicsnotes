import 'server-only';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import manifest from './manifest.json';

export class DiscussionError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}
export function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY &&
    (process.env.DISCUSSION_IP_SALT?.length || 0) >= 32 && process.env.DISCUSSION_ALLOWED_ORIGINS);
}
export function scope(input: Record<string, unknown>, requireSection = false) {
  const { articleKind, articleSlug, contentLocale, sectionId } = input;
  if (![articleKind, articleSlug, contentLocale].every(v => typeof v === 'string') ||
    String(articleSlug).length > 160) throw new DiscussionError('invalid');
  const key = `${articleKind}/${articleSlug}/${contentLocale}`;
  const ids = Object.hasOwn(manifest, key) ? (manifest as Record<string, string[]>)[key] : undefined;
  if (!ids || (requireSection && (typeof sectionId !== 'string' || !ids.includes(sectionId)))) throw new DiscussionError('not_found', 404);
  return { p_kind: articleKind as string, p_slug: articleSlug as string, p_locale: contentLocale as string,
    ...(requireSection ? { p_section: sectionId as string } : {}) };
}
export function visitorToken(request: Request, purpose: 'read' | 'post') {
  // Only trust Vercel's overwritten header in Vercel deployments. Local requests share a development bucket.
  const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.trim() :
    process.env.NODE_ENV === 'development' ? '127.0.0.1' : undefined;
  if (!ip || !isIP(ip)) throw new DiscussionError('unavailable', 503);
  let normalized = ip;
  if (isIP(ip) === 6) {
    const expanded = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
    // Keep IPv6 privacy-address changes within one /64 in the same bucket.
    const [left, right = ''] = expanded.split('::');
    const a = left ? left.split(':') : [], b = right ? right.split(':') : [];
    const parts = expanded.includes('::') ? [...a, ...Array(8 - a.length - b.length).fill('0'), ...b] : a;
    normalized = parts.slice(0, 4).map(n => parseInt(n, 16).toString(16)).join(':') + '::/64';
  }
  return fingerprint(`${purpose}|${new Date().toISOString().slice(0, 10)}|${normalized}`);
}
export function fingerprint(value: string) {
  return createHmac('sha256', process.env.DISCUSSION_IP_SALT!).update(value).digest('hex');
}
export async function rpc<T>(name: string, args: object): Promise<T> {
  if (!configured()) throw new DiscussionError('unavailable', 503);
  const key = process.env.SUPABASE_SECRET_KEY!;
  try {
    const response = await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: key,
        ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify(args), cache: 'no-store', signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (error.message === 'rate_limited') throw new DiscussionError('rate_limited', 429);
      if (error.message === 'duplicate' || error.code === '23505') throw new DiscussionError('duplicate', 409);
      if (error.message === 'invalid_parent' || error.code === '23503') throw new DiscussionError('invalid_parent', 409);
      throw new DiscussionError('unavailable', 503);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof DiscussionError) throw error;
    // Never log URLs, request bodies, IPs, secrets, or PostgREST internals.
    throw new DiscussionError('unavailable', 503);
  }
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
    ...(status === 429 ? { 'Retry-After': '600' } : {}) } });
}
export function failure(error: unknown) {
  return error instanceof DiscussionError ? json({ error: error.code }, error.status) : json({ error: 'invalid' }, 400);
}
