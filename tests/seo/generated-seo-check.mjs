import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { typescriptLoader } from './load-typescript.mjs';

// Read a completed build only. Never starts a server or writes inside the build.
// Example: node tests/seo/generated-seo-check.mjs --dist .next-de-pt-apply-check --output ../evidence/seo/generated-seo.json
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const dist = path.resolve(option('--dist', process.env.NEXT_BUILD_DIR || '.next'));
const output = option('--output', null);
const load = typescriptLoader();
const { locales, localePath, messages } = load('lib/i18n.ts');
const { articleList, loadArticle } = load('lib/articles.ts');
const { pageMetadata, articleMetadata, articleStructuredData, siteUrl } = load('lib/seo.ts');
const sitemap = load('app/sitemap.ts').default;
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'prerender-manifest.json'), 'utf8'));
const reports = [];
const errors = [];

function decode(value = '') {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, numeric, named) => numeric
    ? String.fromCodePoint(numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1), 16) : Number(numeric))
    : ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[named.toLowerCase()]);
}
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, name, double, single]) => [name.toLowerCase(), decode(double ?? single)]));
}
function check(label, run) {
  try { run(); } catch (error) { errors.push({ label, message: error.message }); }
}
function compareMetadata(route, locale, expected, schema = null) {
  check(route, () => {
    assert.ok(manifest.routes[route], 'route must be prerendered');
    const filename = path.join(dist, 'server/app', route === '/' ? 'index.html' : `${route.slice(1)}.html`);
    const html = fs.readFileSync(filename, 'utf8');
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
    assert.ok(head, 'HTML must have a head');
    assert.equal(attributes(html.match(/<html\b[^>]*>/)[0]).lang, locale);
    const links = [...head.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0]));
    const canonicals = links.filter(link => link.rel === 'canonical');
    assert.equal(canonicals.length, 1, 'exactly one canonical');
    assert.equal(canonicals[0].href, expected.alternates.canonical);
    const alternates = links.filter(link => link.rel === 'alternate' && link.hreflang);
    assert.equal(new Set(alternates.map(link => link.hreflang)).size, alternates.length, 'unique language annotations');
    assert.deepEqual(Object.fromEntries(alternates.map(link => [link.hreflang, link.href])), expected.alternates.languages ?? {});
    const metaTags = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0]));
    const meta = name => metaTags.filter(tag => tag.name === name || tag.property === name).map(tag => tag.content);
    const one = (name, value) => assert.deepEqual(meta(name), [value], name);
    const title = typeof expected.title === 'string' ? `${expected.title} | Open Physics Notes` : expected.title.absolute;
    assert.equal(decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1]), title, 'title');
    one('description', expected.description);
    one('og:title', typeof expected.openGraph.title === 'string' ? expected.openGraph.title : expected.openGraph.title.absolute);
    one('og:description', expected.description);
    one('og:url', expected.alternates.canonical);
    one('og:type', expected.openGraph.type);
    one('og:locale', expected.openGraph.locale);
    assert.deepEqual(meta('og:locale:alternate'), expected.openGraph.alternateLocale);
    one('og:image', `${siteUrl}/images/eyecatch.png`);
    one('og:image:alt', 'Open Physics Notes');
    one('twitter:card', 'summary_large_image');
    one('twitter:title', typeof expected.twitter.title === 'string' ? expected.twitter.title : expected.twitter.title.absolute);
    one('twitter:description', expected.description);
    one('twitter:image', `${siteUrl}/images/eyecatch.png`);
    one('twitter:image:alt', 'Open Physics Notes');
    const noindex = meta('robots').some(value => /(?:^|[,\s])noindex(?:$|[,\s])/.test(value));
    assert.equal(noindex, expected.robots?.index === false, 'indexability');
    if (noindex) assert.ok(meta('robots').some(value => /(?:^|[,\s])follow(?:$|[,\s])/.test(value)), 'fallback follow');
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.deepEqual(schemas, schema ? [schema] : [], 'visible-content structured data');
    reports.push({ route, canonical: canonicals[0].href, hreflang: alternates.map(link => link.hreflang), noindex, schema: schema?.['@type'] ?? null, result: 'pass' });
  });
}

for (const locale of locales) {
  const t = messages(locale);
  for (const [route, title, description] of [['/', 'Open Physics Notes', t.description], ['/about', t.about, t.aboutText], ['/privacy', t.privacy, t.overviewText]]) {
    compareMetadata(localePath(locale, route), locale, pageMetadata(title, description, route, locale));
  }
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
    compareMetadata(localePath(locale, `/${kind}/${slug}`), locale, articleMetadata(kind, slug, locale), articleStructuredData(kind, slug, loadArticle(kind, slug, locale)));
  }
}

let sitemapCount = 0;
check('sitemap.xml', () => {
  const xml = fs.readFileSync(path.join(dist, 'server/app/sitemap.xml.body'), 'utf8');
  assert.ok(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  const actual = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    url: decode(body.match(/<loc>(.*?)<\/loc>/)?.[1]),
    languages: Object.fromEntries([...body.matchAll(/<xhtml:link\b[^>]*>/g)].map(match => attributes(match[0])).map(link => [link.hreflang, link.href])),
  }));
  sitemapCount = actual.length;
  const expected = sitemap();
  assert.equal(actual.length, expected.length);
  assert.equal(actual.length, 125, '30 translated static pages + 95 article editions');
  const byUrl = new Map(actual.map(item => [item.url, item]));
  assert.equal(byUrl.size, actual.length, 'no duplicate sitemap URLs');
  for (const entry of expected) {
    const item = byUrl.get(entry.url);
    assert.ok(item, `missing ${entry.url}`);
    assert.deepEqual(item.languages, entry.alternates.languages);
    for (const alternate of Object.values(item.languages)) {
      assert.ok(byUrl.has(alternate), `alternate must be included: ${alternate}`);
      assert.deepEqual(byUrl.get(alternate).languages, item.languages, 'sitemap reciprocity');
    }
    const route = new URL(entry.url).pathname;
    const page = reports.find(report => report.route === route);
    assert.ok(page && !page.noindex, `sitemap URL must be a validated indexable page: ${route}`);
    assert.equal(page.canonical, entry.url, 'sitemap URL must be canonical');
  }
});

check('robots.txt', () => {
  const text = fs.readFileSync(path.join(dist, 'server/app/robots.txt.body'), 'utf8');
  assert.match(text, /User-Agent:\s*\*/i);
  assert.match(text, /Allow:\s*\//i);
  assert.ok(text.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  assert.ok(!/^Disallow:\s*\/\s*$/im.test(text), 'must not block crawlers from canonical or noindex directives');
});

const result = { buildDirectory: dist, checkedAt: new Date().toISOString(), expectedHtmlPages: 220, passedHtmlPages: reports.length, canonicalSitemapUrls: sitemapCount, result: errors.length ? 'fail' : 'pass', errors, pages: reports };
if (output) {
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
}
console.log(JSON.stringify({ ...result, pages: undefined, errorCount: errors.length, errors: errors.slice(0, 8) }, null, 2));
process.exitCode = errors.length ? 1 : 0;
