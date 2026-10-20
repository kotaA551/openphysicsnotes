// Historical layout-migration comparator; comment-removal checks live in tests/no-comments/build-check.mjs.
// Compare two completed builds; no server, network or database access.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { typescriptLoader } from '../seo/load-typescript.mjs';

const [before = '.next-before', after = '.next-after', output] = process.argv.slice(2);
const load = typescriptLoader(), {locales,localePath} = load('lib/i18n.ts'), {articleList,loadArticle} = load('lib/articles.ts');
const hash = value => createHash('sha256').update(value).digest('hex');
const matches = (text, expression) => [...text.matchAll(expression)].map(m => m[0]);
const read = (dir,route) => fs.readFileSync(path.join(dir,'server/app',`${route.slice(1)}.html`),'utf8');
const article = html => html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
const separator = /<hr\b(?=[^>]*\bdata-article-separator="")[^>]*\/?\s*>/g;
const withoutSeparators = html => html.replace(separator, '');
// Removing a sibling changes React's whitespace markers and useId-generated
// summary labels. Only normalize those internal details; authored anchors and
// the persistent discussion-* IDs must still match exactly.
const normalizeReact = html => html.replace(/(?<=\n)<!-- -->(?=\n)/g, '')
  .replace(/(<summary id=")_R_[a-zA-Z0-9]+_(">)/g, '$1REACT_SUMMARY_LABEL$2');
const metadata = html => matches(html.match(/<head\b[^>]*>[\s\S]*?<\/head>/)?.[0] || '', /<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g);
const reports = [];
for (const locale of locales) for (const kind of ['chapters','curiosities']) for (const {slug} of articleList(kind)) {
  const route = localePath(locale,`/${kind}/${slug}`), targeted = kind === 'chapters' || slug === 'differential-geometry';
  const oldHtml = read(before,route), newHtml = read(after,route), oldBody = article(oldHtml), newBody = article(newHtml);
  assert.ok(oldBody && newBody,route);
  assert.equal(matches(newHtml,separator).length,0,`${route}: article separators remain`);
  assert.equal(normalizeReact(newBody),normalizeReact(withoutSeparators(oldBody)),`${route}: content other than article separators changed`);
  const labels = matches(newBody, /<summary id="[^"]+">/g);
  assert.equal(new Set(labels).size,labels.length,`${route}: duplicate discussion summary labels`);
  assert.deepEqual(metadata(newHtml),metadata(oldHtml),`${route}: SEO changed`);
  assert.deepEqual(matches(newHtml,/<script type="application\/ld\+json">[\s\S]*?<\/script>/g),matches(oldHtml,/<script type="application\/ld\+json">[\s\S]*?<\/script>/g),`${route}: structured data changed`);
  assert.equal(newBody.includes('class="article-reading'),targeted,`${route}: scope`);
  if (!targeted) assert.equal(newBody,oldBody,`${route}: unrelated article changed`);
  const fields = {
    headings: /<h[1-6]\b[^>]*id="[^"]*"[^>]*>[\s\S]*?<\/h[1-6]>/g,
    links: /<a\b[^>]*href="[^"]*"[^>]*>/g,
    images: /<img\b[^>]*>/g,
    formulas: /<annotation encoding="application\/x-tex">[\s\S]*?<\/annotation>/g,
    discussions: /<details\b[^>]*data-discussion-section="[^"]*"[^>]*>/g,
    figures: /<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/g,
    otherRules: /<hr\b[^>]*>/g,
  };
  const counts = {};
  for (const [field,pattern] of Object.entries(fields)) {
    const expected = matches(withoutSeparators(oldBody),pattern), actual = matches(newBody,pattern);
    assert.deepEqual(actual,expected,`${route}: ${field} or order changed`); counts[field] = actual.length;
  }
  assert.ok(!/class="[^"]*\bkatex-error\b/.test(newBody),`${route}: KaTeX error`);
  reports.push({route,targeted,contentLocale:loadArticle(kind,slug,locale).contentLocale,removedSeparators:matches(oldBody,separator).length,bodySHA256:hash(newBody),...counts});
}
for (const locale of locales) {
  const name = path.join('server/app/search',`${locale}.body`);
  assert.equal(hash(fs.readFileSync(path.join(before,name))),hash(fs.readFileSync(path.join(after,name))),`${locale}: search data changed`);
}
for (const name of ['sitemap.xml.body','robots.txt.body']) {
  assert.equal(hash(fs.readFileSync(path.join(before,'server/app',name))),hash(fs.readFileSync(path.join(after,'server/app',name))),`${name} changed`);
}
const result = {status:'passed',targetedRoutes:reports.filter(r=>r.targeted).length,untouchedCuriosityRoutes:reports.filter(r=>!r.targeted).length,removedSeparators:reports.reduce((n,r)=>n+r.removedSeparators,0),preservedOtherRules:reports.reduce((n,r)=>n+r.otherRules,0),searchLocales:locales.length,reports};
if (output) fs.writeFileSync(output,JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,reports:undefined}));
