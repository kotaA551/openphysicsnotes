import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeDiscussions, { discussionGroups, discussionSections } from '../../lib/discussions/sections.mjs';
const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath)
  .use(remarkRehype, { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression', 'mdxjsEsm'] })
  .use(rehypeKatex).use(rehypeSlug);
const parse = source => processor.run(processor.parse(source));
test('one panel at 2.3 / 2.4 groups every descendant subsection and example', async () => {
  const tree = await parse('## 2.3 Parent\n\nIntro\n\n### 2.3.1 First\n\nBody\n\n#### Example\n\nExample\n\n#### 1 Step\n\nStep\n\n### 2.3.2 Second\n\nText\n\n## 2.4 Next\n\nNext\n\n### Unnumbered\n\nText');
  const groups = discussionGroups(tree);
  assert.deepEqual(groups.map(g => g.id), ['23-parent', '24-next']);
  assert.deepEqual(groups[0].choices.map(c => c.id), ['23-parent', '231-first', 'example', '1-step', '232-second']);
  assert.deepEqual(groups[1].choices.map(c => c.id), ['24-next', 'unnumbered']);
});
test('numeric ancestry handles existing h2/h3 inconsistencies without dropping intro threads', async () => {
  const tree = await parse('## 11.3 Parent\n\nIntro\n\n### 11.3.1 First\n\nText\n\n## 11.3.2 Second\n\nText\n\n## 11.4 Next\n\nText');
  assert.deepEqual(discussionGroups(tree).map(g => g.id), ['113-parent', '114-next']);
});
test('misleveled numbered worked steps do not split their regular subsection', async () => {
  const tree = await parse('## 7.5 Topic\n\n### 7.5.1 Scattering\n\nBody\n\n#### 1) Setup\n\nStep\n\n## 4) Conservation of flux\n\nProof\n\n### 7.5.2 Next\n\nBody');
  const groups = discussionGroups(tree);
  assert.deepEqual(groups.map(g=>g.id),['75-topic']);
  assert.ok(groups[0].choices.some(c=>c.id==='4-conservation-of-flux'));
});
test('larger h1 division intro belongs to its first h2 section, with one panel per X.Y', async () => {
  const tree = await parse('# 1. Division\n\nIntro\n\n## 1.1 First\n\n### Detail\n\nText\n\n## 1.2 Second\n\nText\n\n# 2. Division\n\nIntro\n\n## 2.1 Next\n\nText');
  const groups = discussionGroups(tree);
  assert.deepEqual(groups.map(g=>g.id),['11-first','12-second','21-next']);
  assert.ok(groups[2].choices.some(c=>c.id==='2-division'));
});
test('all source articles/locales preserve every legacy scope exactly once and every heading anchor', async () => {
  const manifest = JSON.parse(await fs.readFile('lib/discussions/manifest.json', 'utf8'));
  let oldCount = 0, newCount = 0;
  for (const [key, ids] of Object.entries(manifest)) {
    const [kind, slug, locale] = key.split('/');
    const file = path.join(locale === 'en' ? 'content' : `content/translations/${locale}`, kind, `${slug}.mdx`);
    const tree = await parse(matter(await fs.readFile(file, 'utf8')).content);
    const original = structuredClone(tree), legacy = discussionSections(tree), groups = discussionGroups(tree);
    const memberships = groups.flatMap(g => g.choices.map(c => c.id));
    assert.equal(new Set(memberships).size, memberships.length, `${key}: duplicate membership/count`);
    for (const section of legacy) assert.equal(memberships.filter(id => id === section.id).length, 1, `${key}: lost ${section.id}`);
    for (const id of memberships) assert.ok(ids.includes(id), `${key}: invalid API scope ${id}`);
    assert.ok(groups.length <= legacy.length, key);
    rehypeDiscussions()(tree);
    assert.deepEqual(tree.children.filter(n => n.name !== 'SectionDiscussion'), original.children, `${key}: article changed`);
    assert.equal(tree.children.filter(n => n.name === 'SectionDiscussion').length, groups.length);
    oldCount += legacy.length; newCount += groups.length;
  }
  console.log(JSON.stringify({ articles: Object.keys(manifest).length, oldPanels: oldCount, groupedPanels: newCount }));
});
