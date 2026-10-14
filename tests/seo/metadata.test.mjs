import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { resolveAlternates } from 'next/dist/lib/metadata/resolvers/resolve-basics.js';
import { typescriptLoader } from './load-typescript.mjs';

const load = typescriptLoader();
const { locales, localePath, messages } = load('lib/i18n.ts');
const { articleList, loadArticle, translatedArticleLocales } = load('lib/articles.ts');
const { articleMetadata, articleStructuredData, pageMetadata, siteUrl, socialImage } = load('lib/seo.ts');
const sitemap = load('app/sitemap.ts').default;
const robots = load('app/robots.ts').default;
const completeSiteLocales = ['en', 'de', 'pt-BR', 'zh-CN', 'ja'];
const navierStokesLocales = ['en', 'fr', 'de', 'it', 'es', 'pt-BR', 'zh-CN', 'zh-TW', 'ja', 'ko'];
const fullCuriosityLocales = new Set(['navier-stokes-equation', 'black-hole-information-paradox', 'dark-energy', 'dark-matter', 'loop-quantum-gravity', 'string-theory', 'groups-lie-algebras-gauge-theory']);
const expectedArticleLocales = (kind, slug) => kind === 'curiosities' && fullCuriosityLocales.has(slug)
  ? navierStokesLocales : completeSiteLocales;

test('Next serializes root and article alternate URLs exactly as the sitemap uses them', async () => {
  for (const path of ['/', '/about', '/chapters/8-Quantum-field-theory']) {
    const meta = pageMetadata('Example', 'Description', path, 'en');
    const resolved = await resolveAlternates(meta.alternates, new URL(siteUrl), Promise.resolve(path), { trailingSlash: false });
    assert.equal(resolved.canonical.url, meta.alternates.canonical);
    assert.deepEqual(Object.fromEntries(Object.entries(resolved.languages).map(([locale, values]) => [locale, values[0].url])), meta.alternates.languages);
  }
});

test('20 article clusters have 135 real editions, including all ten Navier–Stokes locales, with reciprocal absolute hreflang', () => {
  let count = 0;
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
    const actualLocales = expectedArticleLocales(kind, slug);
    assert.deepEqual(translatedArticleLocales(kind, slug), actualLocales);
    const path = `/${kind}/${slug}`;
    const expected = Object.fromEntries(actualLocales.map(locale => [locale, siteUrl + localePath(locale, path)]));
    expected['x-default'] = siteUrl + path;
    for (const locale of actualLocales) {
      const meta = articleMetadata(kind, slug, locale);
      assert.equal(meta.alternates.canonical, expected[locale]);
      assert.deepEqual(meta.alternates.languages, expected);
      assert.ok(!meta.robots || meta.robots.index !== false);
      assert.equal(meta.openGraph.url, expected[locale]);
      assert.equal(meta.openGraph.type, 'article');
      assert.match(meta.openGraph.locale, /^[a-z]{2}_[A-Z]{2}$/);
      count++;
    }
  }
  assert.equal(count, 135);
});

test('all ten Navier–Stokes editions load their own content and descriptions', () => {
  assert.deepEqual(locales, navierStokesLocales, 'cover every configured site language explicitly');
  const contents = new Set();
  const descriptions = new Set();
  for (const locale of navierStokesLocales) {
    const article = loadArticle('curiosities', 'navier-stokes-equation', locale);
    assert.equal(article.translated, true, `${locale} must not use fallback content`);
    assert.equal(article.contentLocale, locale);
    contents.add(article.content);
    descriptions.add(article.description);
  }
  assert.equal(contents.size, 10, 'every edition must contain distinct localized content');
  assert.equal(descriptions.size, 10, 'every edition must have a localized search description');
});

test('65 fallback pages remain noindex, follow and identify the English canonical content consistently', () => {
  let count = 0;
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
    const original = articleMetadata(kind, slug, 'en');
    for (const locale of locales.filter(locale => !expectedArticleLocales(kind, slug).includes(locale))) {
      const article = loadArticle(kind, slug, locale);
      const meta = articleMetadata(kind, slug, locale);
      assert.deepEqual(meta.robots, { index: false, follow: true });
      assert.equal(meta.alternates.canonical, siteUrl + `/${kind}/${slug}`);
      assert.equal(meta.alternates.languages, undefined);
      assert.equal(meta.openGraph.url, meta.alternates.canonical);
      assert.equal(meta.openGraph.locale, 'en_US');
      assert.equal(meta.title, original.title);
      assert.equal(meta.description, original.description);
      assert.equal(articleStructuredData(kind, slug, article), null);
      count++;
    }
  }
  assert.equal(count, 65);
});

test('the sitemap contains only 165 canonical pages and matches every HTML alternate cluster', () => {
  const entries = sitemap();
  assert.equal(entries.length, 165);
  const byUrl = new Map(entries.map(entry => [entry.url, entry]));
  assert.equal(byUrl.size, entries.length);
  for (const entry of entries) {
    assert.equal(new URL(entry.url).origin, siteUrl);
    assert.ok(!entry.url.includes('/en/'));
    const languages = entry.alternates.languages;
    assert.ok(Object.values(languages).includes(entry.url));
    for (const url of Object.values(languages)) {
      assert.ok(byUrl.has(url), `${url} must be canonical and included`);
      assert.deepEqual(byUrl.get(url).alternates.languages, languages);
    }
  }
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) for (const locale of expectedArticleLocales(kind, slug)) {
    const meta = articleMetadata(kind, slug, locale);
    assert.deepEqual(byUrl.get(meta.alternates.canonical).alternates.languages, meta.alternates.languages);
  }
  for (const locale of locales) for (const path of ['/', '/about', '/privacy']) {
    const meta = pageMetadata('Example', messages(locale).description, path, locale);
    assert.deepEqual(byUrl.get(meta.alternates.canonical).alternates.languages, meta.alternates.languages);
  }
});

test('localized descriptions remain whole; English descriptions are useful prose without raw math', () => {
  const descriptions = new Set();
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) {
    const en = loadArticle(kind, slug, 'en');
    assert.match(en.description, /\.$/);
    assert.ok(!/[$\\{}<>]/.test(en.description));
    assert.ok(en.description.length > 70);
    descriptions.add(en.description);
    for (const locale of expectedArticleLocales(kind, slug).filter(locale => locale !== 'en')) {
      const { data } = matter(fs.readFileSync(`content/translations/${locale}/${kind}/${slug}.mdx`, 'utf8'));
      assert.equal(loadArticle(kind, slug, locale).description, data.description.replace(/\s+/g, ' ').trim());
    }
  }
  assert.equal(descriptions.size, 20);
  const longDescription = 'A complete, reviewed description. '.repeat(8);
  assert.equal(pageMetadata('Example', longDescription, '/about', 'de').description, longDescription, 'reviewed descriptions must not be truncated');
});

test('LearningResource JSON-LD describes actual visible content without invented authors or dates', () => {
  for (const kind of ['chapters', 'curiosities']) for (const { slug } of articleList(kind)) for (const locale of expectedArticleLocales(kind, slug)) {
    const article = loadArticle(kind, slug, locale);
    const schema = articleStructuredData(kind, slug, article);
    assert.equal(schema['@type'], 'LearningResource');
    assert.equal(schema.name, article.title);
    assert.equal(schema.inLanguage, locale);
    assert.equal(schema.url, articleMetadata(kind, slug, locale).alternates.canonical);
    assert.equal(schema['@id'], schema.url + '#learning-resource');
    assert.equal(schema.isAccessibleForFree, true);
    assert.equal(schema.author, undefined);
    assert.equal(schema.datePublished, undefined);
    assert.equal(schema.dateModified, undefined);
  }
});

test('partial availability is respected, missing slugs have no metadata, and crawl/social assets stay valid', () => {
  const partial = pageMetadata('Example', 'Description', '/chapters/example', 'de', { availableLocales: ['en', 'de'] });
  assert.deepEqual(Object.keys(partial.alternates.languages), ['en', 'de', 'x-default']);
  assert.equal(articleMetadata('chapters', 'does-not-exist', 'en'), null);
  assert.deepEqual(translatedArticleLocales('chapters', 'does-not-exist'), []);
  assert.deepEqual(robots(), { rules: { userAgent: '*', allow: '/' }, sitemap: siteUrl + '/sitemap.xml' });
  assert.ok(fs.existsSync('public' + socialImage));
  assert.ok(!fs.existsSync('public/sitemap.xml'));
  assert.ok(!fs.existsSync('public/robots.txt'));
  assert.ok(!fs.existsSync('next-sitemap.config.js'));
});
