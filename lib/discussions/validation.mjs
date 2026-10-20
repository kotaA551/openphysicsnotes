export const NAME_LIMIT = 60;
export const CONTENT_LIMIT = 3000;
export const BODY_LIMIT = 20000;
const clean = value => value.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '').trim();
export function validId(value) { return typeof value === 'string' && /^[1-9][0-9]{0,17}$/.test(value); }
export function validatePost(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid');
  if (typeof input.website !== 'string' || input.website !== '') throw new Error('invalid');
  if (typeof input.content !== 'string' || typeof input.displayName !== 'string') throw new Error('invalid');
  if (typeof input.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.requestId)) throw new Error('invalid');
  if (input.parentId !== null && !validId(input.parentId)) throw new Error('invalid');
  const content = clean(input.content);
  const displayName = clean(input.displayName).replace(/\s+/g, ' ');
  if (!content || [...content].length > CONTENT_LIMIT || [...displayName].length > NAME_LIMIT) throw new Error('invalid');
  return { content, displayName, parentId: input.parentId, requestId: input.requestId };
}
export function checkOrigin(origin, allowed) {
  if (!origin) return false;
  try { return new URL(origin).origin === origin && allowed.includes(origin); } catch { return false; }
}
export async function readLimitedJson(request) {
  if (Number(request.headers.get('content-length')) > BODY_LIMIT) throw new Error('too_large');
  if (!request.body) throw new Error('invalid');
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > BODY_LIMIT) { await reader.cancel(); throw new Error('too_large'); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}
