import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { articleSections } from '../../lib/search/build.mjs';

test('index shares actual rendered anchors, including math, repeated, formatted and CJK headings', async () => {
  const source = 'Intro prose.\n\n## Résumé *one*\n\nBody [link](https://example.com).\n\n## Résumé *one*\n\nSecond body.\n\n## 量子と $E=mc^2$\n\n<Callout>Visible **callout** text.</Callout>\n\n$$\n\\frac{x}{y}\n$$\n\n```js\nraw_source_noise()\n```\n\n> ### Nested heading\n> Quoted prose\n\n## Empty heading';
  const sections = await articleSections(source);
  const { content } = await compileMDX({ source, components: { Callout: ({ children }) => children }, options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex, rehypeSlug] } } });
  const html = renderToStaticMarkup(content);
  const ids = [...html.matchAll(/<h[1-6] id="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&').replaceAll('&quot;', '"'));
  assert.deepEqual(sections.filter(section => section.id).map(section => section.id), ids);
  const text = sections.map(section => section.text).join(' ');
  assert.match(text, /Visible callout text/);
  assert.doesNotMatch(text, /frac|raw_source_noise|https:\/\/|Callout|katex|mc/);
  assert.equal(sections[0].text, 'Intro prose.');
});
