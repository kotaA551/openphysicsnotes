# International SEO checks

English URLs remain at the root. Static pages have ten translated variants; articles advertise only editions with their own translated MDX. All 19 articles have English, German, Brazilian Portuguese, Simplified Chinese and Japanese editions. The Navier–Stokes article additionally has French, Italian, Spanish, Traditional Chinese and Korean editions, covering all ten site languages. That gives 100 real article editions and 90 English fallback pages.

`translatedArticleLocales` supplies article availability. `languageAlternates` supplies the same absolute, reciprocal hreflang cluster (including itself and English `x-default`) to page metadata and the sitemap. Translated articles are self-canonical. English fallback articles keep `noindex, follow`, remain crawlable, point to the English canonical, and are excluded from alternate-language clusters and the sitemap.

Article social metadata uses the content language and canonical URL. Open Graph requires `language_TERRITORY`; its locale mapping does not change the generic language targeting in hreflang. Explicit localized frontmatter descriptions are preserved in full. The 19 English summaries in `lib/article-descriptions.ts` replace automatically cut introduction excerpts; a future English frontmatter description takes precedence.

Actual article editions expose `LearningResource` structured data describing the displayed content. Fallback duplicates have no separate learning-resource entity. No author, publication date, review score or rich-result eligibility is invented. JSON-LD remains escaped before insertion into HTML.

The native Next metadata routes `app/sitemap.ts` and `app/robots.ts` are the only sitemap/robots generators. The obsolete `next-sitemap.config.js` was removed; no postbuild next-sitemap command is configured. Do not add static public copies that conflict with these routes. Sitemap modification dates are omitted until reliable per-article dates exist.

Run focused checks without rebuilding:

```sh
node --test tests/seo/metadata.test.mjs
npx tsc --noEmit --incremental false
```

After a coordinated production build, verify all 220 generated HTML pages, 130 sitemap URLs, reciprocal alternates, robots directives, descriptions, Open Graph/Twitter fields and structured data. The checker also verifies all ten Navier–Stokes bodies have the requested content language, no fallback notice, rendered KaTeX/MathML without KaTeX errors, and the complete reciprocal language cluster:

```sh
node tests/seo/generated-seo-check.mjs --dist .next-de-pt-apply-check --output ../evidence/seo/generated-seo.json
```

The checker reads the selected build only and does not start a server, modify a build or contact the production website. Run from the repository being checked. It can inspect any completed custom `NEXT_BUILD_DIR`; stale pre-SEO builds are expected to fail against the new source metadata.

Primary references checked 2026-10-13:

- [Google: localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: descriptive snippets and description length](https://developers.google.com/search/docs/appearance/snippet)
- [Next.js 15: metadata API](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata)
- [Next.js: JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
- [Open Graph protocol](https://ogp.me/)
- [Schema.org: LearningResource](https://schema.org/LearningResource)
