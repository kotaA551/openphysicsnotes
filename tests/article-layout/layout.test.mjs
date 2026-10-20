import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeArticleLayout from '../../lib/article-layout.mjs';
import { articleGroups } from '../../lib/article-structure.mjs';
import { typescriptLoader } from '../seo/load-typescript.mjs';

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath)
  .use(remarkRehype, { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression', 'mdxjsEsm'] })
  .use(rehypeKatex).use(rehypeSlug).use(rehypeAutolink, { behavior: 'wrap' });
const parse = source => parser.run(parser.parse(source));
const annotate = rehypeArticleLayout();
const groupsWithoutOffsets = tree => articleGroups(tree).map(({ start, end, ...group }) => group);
const withoutSeparators = tree => ({ ...tree, children: tree.children.filter(node => !(node.type === 'element' && node.tagName === 'hr')) });

test('roles distinguish sections, nested numbered headings and proof steps without touching nested blocks', async () => {
  const tree = await parse('# Division\n\nIntro\n\n## 7.1 Topic\n\nText\n\n### 7.1.1 Subsection\n\nText\n\n## Proof\n\nProof\n\n## Step 1\n\nStep\n\n## 7.1.2 Misleveled subsection\n\nBody\n\n#### Detail\n\nDetail\n\n---\n\n> ## Quoted heading\n>\n> ---\n>\n> Quoted text\n\n$$x^2$$\n\n## 7.2 Next\n\nEnd');
  const original = structuredClone(tree), groups = groupsWithoutOffsets(tree);
  annotate(tree);
  assert.deepEqual(tree.children.filter(n => /^h[1-6]$/.test(n.tagName)).map(n => n.properties['data-article-heading']),
    ['division','section','subsection','detail','detail','subsection','detail','section']);
  assert.deepEqual(tree.children.find(n => n.tagName === 'blockquote'), original.children.find(n => n.tagName === 'blockquote'));
  assert.equal(tree.children.filter(n => n.tagName === 'hr').length, 0);
  assert.deepEqual(groupsWithoutOffsets(tree), groups);
  for (const node of tree.children) {
    if (node.properties) delete node.properties['data-article-heading'];
  }
  assert.deepEqual(tree, withoutSeparators(original), 'only root separators and heading annotations may change');
});

test('every targeted translation and fallback removes separators while retaining all other AST nodes and article groups', async () => {
  const load = typescriptLoader(), {locales} = load('lib/i18n.ts'), {articleList,loadArticle} = load('lib/articles.ts');
  const cache = new Map();
  let routes = 0, fallbacks = 0, headings = 0;
  for (const locale of locales) for (const kind of ['chapters','curiosities']) {
    for (const {slug} of articleList(kind).filter(item => kind === 'chapters' || item.slug === 'differential-geometry')) {
      const article = loadArticle(kind,slug,locale), key = `${kind}/${slug}/${article.contentLocale}`;
      routes++; if (!article.translated) fallbacks++;
      if (cache.has(key)) continue;
      const tree = await parse(article.content), original = structuredClone(tree), groups = groupsWithoutOffsets(tree);
      annotate(tree);
      assert.deepEqual(groupsWithoutOffsets(tree), groups, key);
      assert.equal(tree.children.filter(n => n.tagName === 'hr').length, 0, key);
      for (const node of tree.children) {
        if (/^h[1-6]$/.test(node.tagName)) { assert.ok(node.properties['data-article-heading'], key); headings++; }
        if (node.properties) delete node.properties['data-article-heading'];
      }
      assert.deepEqual(tree, withoutSeparators(original), key);
      cache.set(key,true);
    }
  }
  assert.equal(routes,130);
  console.log(JSON.stringify({routes,fallbacks,sourceEditions:cache.size,headings}));
});
