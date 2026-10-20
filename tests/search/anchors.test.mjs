import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import rehypeSlug from 'rehype-slug';
import rehypeArticleAnchors, { articleHeadingIds } from '../../lib/article-anchors.mjs';
import { articleSections } from '../../lib/search/build.mjs';
import { articleGroups } from '../../lib/article-structure.mjs';

test('translated visible headings retain published links in HTML, search and article groups', async () => {
  const source = '## 1. Mécanique\n\nLe mouvement.\n\n## 2. Énergie\n\nLe travail.';
  const ids = ['1-mechanics', '2-energy'];
  let groups;
  const inspect = () => tree => { groups = articleGroups(tree); };
  const { content } = await compileMDX({ source, options: { mdxOptions: {
    rehypePlugins: [rehypeSlug, [rehypeArticleAnchors, { ids }], inspect],
  } } });
  const html = renderToStaticMarkup(content);
  assert.deepEqual([...html.matchAll(/<h2 id="([^"]+)"/g)].map(m => m[1]), ids);
  assert.match(html, /Mécanique/);
  assert.deepEqual((await articleSections(source, ids)).filter(x => x.id).map(x => x.id), ids);
  assert.deepEqual(groups.map(g => g.id), ids);
  assert.throws(() => rehypeArticleAnchors({ ids })( { children: [] } ), /heading count/);
});

test('only the 65 formerly fallback editions receive preserved source anchors', () => {
  assert.equal(articleHeadingIds('chapters', '1-Newton-mechanics', 'fr').length, 65);
  assert.equal(articleHeadingIds('curiosities', 'differential-geometry', 'ko').length, 62);
  for (const locale of ['en', 'ja', 'de', 'pt-BR', 'zh-CN']) assert.deepEqual(articleHeadingIds('chapters', '1-Newton-mechanics', locale), []);
  assert.deepEqual(articleHeadingIds('curiosities', 'dark-energy', 'fr'), []);
});
