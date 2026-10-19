import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { typescriptLoader } from '../seo/load-typescript.mjs';
import { articleSections } from '../../lib/search/build.mjs';
import { articleHeadingIds } from '../../lib/article-anchors.mjs';

const load = typescriptLoader(), { locales } = load('lib/i18n.ts'), { articleList } = load('lib/articles.ts');
const selectedLocales = process.env.CHECK_LOCALES ? process.env.CHECK_LOCALES.split(',') : locales;
assert.ok(selectedLocales.length && selectedLocales.every(locale => locales.includes(locale)), 'valid locale selection');
const expectedCount = selectedLocales.length * (articleList('chapters').length + articleList('curiosities').length);
const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath);
const base = '80aa0989cddcdd37a0a29d702f415fde18e62f26';
const baselineFiles = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', base], { encoding: 'utf8' }).trim().split('\n'));
const hash = value => createHash('sha256').update(value).digest('hex');
const normalizeHref = value => value.replace(/^\/(?:fr|de|it|es|pt-BR|zh-CN|zh-TW|ja|ko)(?=\/)/, '');
const annotationFile = 'tests/translations/math-annotations.json';
const annotations = fs.existsSync(annotationFile) ? JSON.parse(fs.readFileSync(annotationFile, 'utf8')) : {};
const localizeMath = (value, locale) => {
  for (const [original, translated] of Object.entries(annotations[locale] || {})) value = value.split(`\\text{${original}}`).join(`\\text{${translated}}`);
  return value;
};
function inspect(source, locale) {
  const data = matter(source), tree = parser.parse(data.content);
  const result = { description: data.data.description, headings: [], math: [], images: [], links: [], code: [], prose: [], structure: {}, components: [] };
  const visit = node => {
    if (['heading', 'paragraph', 'listItem', 'blockquote', 'table', 'tableRow', 'tableCell'].includes(node.type)) result.structure[node.type] = (result.structure[node.type] || 0) + 1;
    if (node.type === 'heading') result.headings.push(node.depth);
    if (['math', 'inlineMath'].includes(node.type)) result.math.push(node.value);
    if (node.type === 'image') result.images.push(node.url);
    if (node.type === 'link') result.links.push(normalizeHref(node.url));
    if (node.type === 'code') result.code.push([node.lang, node.value]);
    if (node.type === 'text' && /[A-Za-z]/.test(node.value) && node.value.trim().length > 90) result.prose.push(node.value.trim());
    if (['mdxJsxFlowElement','mdxJsxTextElement'].includes(node.type)) {
      result.components.push(node.name);
      for (const a of node.attributes || []) {
        if (a.name === 'src') result.images.push(a.value);
        if (a.name === 'href') result.links.push(normalizeHref(a.value));
        if (node.name === 'CycloidalPendulumFigure' && a.name === 'locale') assert.equal(a.value, locale, 'figure language');
      }
    }
    for (const child of node.children || []) visit(child);
  };
  visit(tree);
  return { ...result, content: data.content };
}

const rows = [], errors = [], suspects = [], originals = new Map();
for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
  const file = `content/${kind}/${slug}.mdx`;
  originals.set(`${kind}/${slug}`, inspect(fs.readFileSync(file, 'utf8'), 'en'));
}
for (const locale of selectedLocales) for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
  const file = `content/${locale === 'en' ? '' : `translations/${locale}/`}${kind}/${slug}.mdx`;
  try {
    assert.ok(fs.existsSync(file), 'complete translated file is missing');
    const raw = fs.readFileSync(file, 'utf8'), actual = inspect(raw, locale), original = originals.get(`${kind}/${slug}`), fresh = !baselineFiles.has(file);
    if (locale !== 'en') assert.ok(typeof actual.description === 'string' && actual.description.trim().length >= 35, 'localized description');
    assert.ok(!raw.includes('\uFFFD'), 'replacement character');
    assert.deepEqual(actual.headings, original.headings, 'heading levels/count/order');
    assert.deepEqual(actual.images, original.images, 'image references/order');
    assert.deepEqual(actual.links, original.links, 'link targets/order');
    assert.deepEqual(actual.code, original.code, 'code blocks');
    if (fresh) {
      assert.deepEqual([...actual.math].sort(), original.math.map(value => localizeMath(value, locale)).sort(), 'every mathematical expression retained, allowing only documented text labels');
      assert.deepEqual(actual.structure, original.structure, 'all paragraph/list/table blocks retained');
      assert.deepEqual(actual.components, original.components, 'components retained');
      const EnglishResidue = actual.prose.filter(text => original.prose.includes(text));
      assert.deepEqual(EnglishResidue, [], 'untranslated long prose');
    }
    const anchors = articleHeadingIds(kind, slug, locale);
    const sections = await articleSections(actual.content, anchors);
    if (anchors.length) assert.deepEqual(sections.filter(x => x.id).map(x => x.id), anchors, 'published anchors');
    if (locale !== 'en') for (const text of actual.prose.filter(text => original.prose.includes(text))) suspects.push({ file, text });
    rows.push({ file, locale, kind, slug, fresh, sha256: hash(raw), bytes: Buffer.byteLength(raw), headings: actual.headings.length, math: actual.math.length, sections: sections.length, status: 'pass' });
  } catch (error) { errors.push({ file, error: error.message }); }
}
const result = { base, checkedAt: new Date().toISOString(), expected: expectedCount, checked: rows.length, errors, englishProseReview: suspects, byLocale: Object.fromEntries(selectedLocales.map(locale => [locale, { chapters: rows.filter(x=>x.locale===locale&&x.kind==='chapters').length, curiosities: rows.filter(x=>x.locale===locale&&x.kind==='curiosities').length }])), rows };
const output = process.argv[2] || '../evidence/translation-source-check.json';
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ expected: result.expected, checked: result.checked, byLocale: result.byLocale, errorCount: errors.length, errors: errors.slice(0, 5).map(x => ({ file: x.file, error: x.error.slice(0, 300) })), englishProseReview: suspects.length }));
process.exitCode = errors.length || rows.length !== expectedCount ? 1 : 0;
