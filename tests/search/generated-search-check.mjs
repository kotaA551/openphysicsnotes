import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { typescriptLoader } from '../seo/load-typescript.mjs';

// Verifies the completed build, including every result target in all ten locales.
const dist = process.env.NEXT_BUILD_DIR || '.next';
const load = typescriptLoader();
const { locales } = load('lib/i18n.ts');
const { loadArticle } = load('lib/articles.ts');
const { prepareIndex, search, MAX_INDEX_BYTES } = load('lib/search/engine.ts');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'prerender-manifest.json'), 'utf8'));
const report = [];
const decode = value => value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, numeric, named) => numeric
  ? String.fromCodePoint(numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1), 16) : Number(numeric))
  : ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[named.toLowerCase()]);

for (const locale of locales) {
  const raw = fs.readFileSync(path.join(dist, 'server/app/search', `${locale}.body`));
  assert.ok(raw.length < MAX_INDEX_BYTES);
  assert.ok(manifest.routes[`/search/${locale}`], 'locale index must be static');
  const index = JSON.parse(raw);
  const prepared = prepareIndex(index);
  assert.equal(index.articles.length, 20);
  const headings = index.articles.map(article => {
    assert.ok(article.href.startsWith(locale === 'en' ? '/' : `/${locale}/`));
    const [kind, slug] = article.href.split('/').slice(-2);
    const expected = loadArticle(kind, slug, locale);
    assert.equal(article.contentLocale, expected.contentLocale);
    assert.equal(article.title, expected.title);
    const html = fs.readFileSync(path.join(dist, 'server/app', `${article.href.slice(1)}.html`), 'utf8');
    assert.ok(html.includes('id="main-content"'));
    return new Set(['main-content', ...[...html.matchAll(/<h[1-6]\b[^>]*\bid="([^"]+)"/g)].map(match => decode(match[1]))]);
  });
  for (const section of index.sections) {
    assert.ok(headings[section.article].has(section.id || 'main-content'), `${locale}: missing rendered anchor ${section.id}`);
    assert.doesNotMatch(section.text, /<Callout|<RelatedBooks|\\begin\{|\\frac\{|mdxJsx|className=/);
  }
  const navier = index.articles.findIndex(article => article.href.endsWith('/navier-stokes-equation'));
  // Full translated topic titles work even when an article explicitly falls back.
  assert.ok(search(prepared, index.articles[navier].title).some(result => result.href.includes('/navier-stokes-equation#')));
  // Body prose comes from the displayed edition, not translated UI labels.
  const body = index.sections.find(section => section.article === navier && section.text.length > 40);
  const phrase = body.text.slice(0, 35);
  assert.ok(search(prepared, phrase).some(result => result.href.includes('/navier-stokes-equation#')));
  const home = fs.readFileSync(path.join(dist, 'server/app', locale === 'en' ? 'index.html' : `${locale}.html`), 'utf8');
  assert.ok(home.indexOf('class="brand"') < home.indexOf('class="header-search'));
  assert.ok(home.indexOf('class="header-search') < home.indexOf('class="language-menu"'));
  assert.ok(!home.includes(body.text), 'body index must not be serialized into the home page');
  report.push({ locale, articles: index.articles.length, sections: index.sections.length, bytes: raw.length, gzipBytes: gzipSync(raw).length, fallbackArticles: index.articles.filter(article => article.contentLocale !== locale).length, anchors: 'all verified' });
}
// Source content must not be copied into any browser JS chunk.
const chunks = fs.readdirSync(path.join(dist, 'static'), { recursive: true }).filter(file => String(file).endsWith('.js'));
const english = JSON.parse(fs.readFileSync(path.join(dist, 'server/app/search/en.body'), 'utf8'));
const distinctive = english.sections.filter(section => section.text.length > 120).slice(0, 8).map(section => section.text.slice(0, 120));
for (const file of chunks) {
  const code = fs.readFileSync(path.join(dist, 'static', file), 'utf8');
  for (const text of distinctive) assert.ok(!code.includes(text), 'article corpus leaked into browser JavaScript');
}
console.log(JSON.stringify({ result: 'pass', locales: report, browserChunksChecked: chunks.length }, null, 2));
