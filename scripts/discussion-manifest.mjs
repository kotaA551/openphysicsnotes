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
import { discussionSections } from '../lib/discussions/sections.mjs';

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath)
  .use(remarkRehype, { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression', 'mdxjsEsm'] })
  .use(rehypeKatex).use(rehypeSlug);
const manifest = {};
async function collect(directory, locale, kind) {
  let files;
  try { files = await fs.readdir(directory); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const file of files.sort().filter(file => file.endsWith('.mdx'))) {
    const source = matter(await fs.readFile(path.join(directory, file), 'utf8')).content;
    const tree = await processor.run(processor.parse(source));
    manifest[`${kind}/${file.slice(0, -4)}/${locale}`] = discussionSections(tree).map(section => section.id);
  }
}
for (const kind of ['chapters', 'curiosities']) {
  await collect(`content/${kind}`, 'en', kind);
  for (const locale of ['fr', 'de', 'it', 'es', 'zh-CN', 'zh-TW', 'ja', 'ko']) {
    await collect(`content/translations/${locale}/${kind}`, locale, kind);
  }
}
await fs.writeFile('lib/discussions/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Discussion manifest: ${Object.keys(manifest).length} articles, ${Object.values(manifest).reduce((n, ids) => n + ids.length, 0)} sections`);
