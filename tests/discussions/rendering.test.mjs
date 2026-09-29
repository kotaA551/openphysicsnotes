import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeDiscussions from '../../lib/discussions/sections.mjs';

test('renderer inserts once at section end without changing anchors or touching quoted headings', async () => {
  const source = '## Parent\n\n### Repeated\n\nFirst body\n\n### Repeated\n\nSecond body\n\n> ## Quoted heading\n> Quoted text\n\n## Last\n\nLast body';
  const { content } = await compileMDX({ source, components: { SectionDiscussion: ({ sectionId }) => createElement('aside', { 'data-section': sectionId }, 'Questions & Discussion') }, options: { mdxOptions: { rehypePlugins: [rehypeSlug, [rehypeAutolink, { behavior: 'wrap' }], rehypeDiscussions] } } });
  const html = renderToStaticMarkup(content);
  assert.equal((html.match(/data-section=/g) || []).length, 3);
  assert.ok(html.includes('id="repeated"')); assert.ok(html.includes('id="repeated-1"'));
  assert.ok(html.indexOf('First body') < html.indexOf('data-section="repeated"'));
  assert.ok(html.indexOf('data-section="repeated"') < html.indexOf('id="repeated-1"'));
  assert.ok(!html.includes('data-section="parent"'));
  assert.ok(!html.includes('data-section="quoted-heading"'));
  assert.ok(html.indexOf('Last body') < html.indexOf('data-section="last"'));
});
