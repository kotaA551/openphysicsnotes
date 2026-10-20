import assert from 'node:assert/strict';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const load = typescriptLoader();
const { locales } = load('lib/i18n.ts');
const { prepareIndex, search } = load('lib/search/engine.ts');
const origin = process.env.SEARCH_PREVIEW_URL || 'http://127.0.0.1:3138';
const report = [];

for (const locale of locales) {
  const response = await fetch(`${origin}/search/${locale}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  assert.match(response.headers.get('cache-control'), /must-revalidate/);
  const index = await response.json();
  const article = index.articles.find(article => article.href.endsWith('/navier-stokes-equation'));
  assert.equal(article.contentLocale, locale, 'latest Navier edition must be translated in every locale');
  const result = search(prepareIndex(index), article.title)[0];
  const page = await fetch(`${origin}${result.href.split('#')[0]}`);
  assert.equal(page.status, 200);
  const html = await page.text();
  const id = decodeURIComponent(result.href.split('#')[1]);
  const escaped = id.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  assert.ok(html.includes(`id="${escaped}"`), 'selected result has an actual HTML anchor');
  assert.ok(html.includes('<title>'));
  assert.ok(html.includes('role="combobox"'));
  report.push({ locale, href: result.href, status: page.status, cache: response.headers.get('cache-control') });
}
assert.equal((await fetch(`${origin}/search/not-a-locale`)).status, 404);
console.log(JSON.stringify({ result: 'pass', preview: origin, requests: report, invalidLocale: 404 }, null, 2));
