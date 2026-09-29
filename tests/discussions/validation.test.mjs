import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { validatePost, checkOrigin, readLimitedJson, BODY_LIMIT, validId } from '../../lib/discussions/validation.mjs';
const input = () => ({ displayName: '', content: 'A question', parentId: null, website: '', requestId: randomUUID() });
test('server rejects empty, invisible, oversized and bot submissions', () => {
  for (const content of ['', ' \n\t　', '\u200b\u2060', 'x'.repeat(3001)]) assert.throws(() => validatePost({ ...input(), content }));
  assert.throws(() => validatePost({ ...input(), displayName: 'x'.repeat(61) }));
  assert.throws(() => validatePost({ ...input(), website: 'spam' }));
  assert.throws(() => validatePost({ ...input(), parentId: '-1' }));
  assert.throws(() => validatePost({ ...input(), requestId: 'not-a-uuid' }));
  assert.equal(validatePost({ ...input(), displayName: '  ', content: ' 日本語の質問 ' }).content, '日本語の質問');
  assert.equal(validatePost({ ...input(), content: '<script>alert(1)</script>' }).content, '<script>alert(1)</script>');
  assert.equal(validId('9007199254740993'), true); assert.equal(validId('1 or 1=1'), false);
});
test('origin allowlist rejects absent, null, prefix-matching and foreign origins', () => {
  const allowed = ['https://www.openphysicsnotes.com'];
  for (const origin of [null, 'null', 'https://www.openphysicsnotes.com.evil.test', 'https://evil.test']) assert.equal(checkOrigin(origin, allowed), false);
  assert.equal(checkOrigin(allowed[0], allowed), true);
});
test('streamed JSON has a byte limit even without content-length', async () => {
  const body = JSON.stringify(input());
  assert.equal((await readLimitedJson(new Request('http://localhost', { method: 'POST', body }))).content, 'A question');
  await assert.rejects(readLimitedJson(new Request('http://localhost', { method: 'POST', body: 'x'.repeat(BODY_LIMIT + 1) })), /too_large/);
});
