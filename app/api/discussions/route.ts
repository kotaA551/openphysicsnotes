import { configured, scope, visitorToken, fingerprint, rpc, json, failure, DiscussionError } from '@/lib/discussions/server';
import { validatePost, readLimitedJson, checkOrigin, validId } from '@/lib/discussions/validation.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const input = Object.fromEntries(new URL(request.url).searchParams);
    const isCounts = input.mode === 'counts';
    const args = scope(input, !isCounts);
    if (!configured()) return json({ error: 'unavailable' }, 503);
    const permitted = await rpc<boolean>('discussion_read_gate', { p_token: visitorToken(request, 'read') });
    if (!permitted) throw new DiscussionError('rate_limited', 429);
    if (isCounts) return json({ counts: await rpc('discussion_counts', args) });
    if ((input.parentId && !validId(input.parentId)) || (input.after && !validId(input.after))) throw new DiscussionError('invalid');
    return json(await rpc('discussion_list', { ...args, p_parent: input.parentId || null, p_after: input.after || '0' }));
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    if (!configured()) throw new DiscussionError('unavailable', 503);
    const allowed = process.env.DISCUSSION_ALLOWED_ORIGINS!.split(',').map(s => s.trim()).filter(Boolean);
    if (!checkOrigin(request.headers.get('origin'), allowed) || request.headers.get('sec-fetch-site') === 'cross-site') throw new DiscussionError('forbidden', 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new DiscussionError('invalid', 415);
    const input = await readLimitedJson(request);
    const value = validatePost(input);
    const args = scope(input, true);
    const digest = fingerprint(JSON.stringify([args, value.parentId, value.content.replace(/\s+/g, ' ').toLowerCase()]));
    const result = await rpc('discussion_post', { ...args, p_parent: value.parentId, p_name: value.displayName,
      p_content: value.content, p_token: visitorToken(request, 'post'), p_fingerprint: digest, p_request: value.requestId });
    return json(result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'too_large') return json({ error: 'invalid' }, 413);
    return failure(error);
  }
}
