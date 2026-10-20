# International SEO checks

English URLs remain at the root. Static pages have ten translated variants; articles advertise only editions with their own complete translated MDX. All 12 chapters and 8 curiosities now have editions in English, French, German, Italian, Spanish, Brazilian Portuguese, Simplified Chinese, Traditional Chinese, Japanese and Korean. This gives 200 real article editions, zero English fallback pages, and 230 canonical sitemap URLs including the homepage, About and Privacy variants.

`translatedArticleLocales` supplies article availability. `languageAlternates` supplies the same absolute, reciprocal hreflang cluster (including itself and English `x-default`) to page metadata and the sitemap. Translated articles are self-canonical. English fallback articles keep `noindex, follow`, remain crawlable, point to the English canonical, and are excluded from alternate-language clusters and the sitemap.

Article social metadata uses the content language and canonical URL. Open Graph requires `language_TERRITORY`; its locale mapping does not change the generic language targeting in hreflang. Explicit localized frontmatter descriptions are preserved in full. The 19 English summaries in `lib/article-descriptions.ts` replace automatically cut introduction excerpts; the new Groups, Lie algebras and gauge theory article uses an explicit English frontmatter description, which takes precedence.

Actual article editions expose `LearningResource` structured data describing the displayed content. Fallback duplicates have no separate learning-resource entity. No author, publication date, review score or rich-result eligibility is invented. JSON-LD remains escaped before insertion into HTML.

The native Next metadata routes `app/sitemap.ts` and `app/robots.ts` are the only sitemap/robots generators. The obsolete `next-sitemap.config.js` was removed; no postbuild next-sitemap command is configured. Do not add static public copies that conflict with these routes. Sitemap modification dates are omitted until reliable per-article dates exist.

Run focused checks without rebuilding:

```sh
node --test tests/seo/metadata.test.mjs
npx tsc --noEmit --incremental false
```

After a coordinated build, verify all 230 generated HTML pages, 230 sitemap URLs, reciprocal alternates, robots directives, descriptions, Open Graph/Twitter fields and structured data. The checker also verifies all 200 article bodies have the requested content language, no fallback notice, rendered KaTeX/MathML without KaTeX errors, and the complete reciprocal language cluster:

```sh
node tests/seo/generated-seo-check.mjs --dist .next --output ../evidence/generated-seo.json
node tests/search/generated-search-check.mjs
```

Also run `node tests/curiosities/source-check.mjs` after regenerating the discussion manifest, and `node tests/curiosities/generated-check.mjs` after the build. They verify the expanded fifty editions, preserved old headings and discussion IDs, mathematics, source-link parity, SVG safety, and the Differential Geometry style scope across all ten routes.

The checker reads the selected build only and does not start a server, modify a build or contact the production website. Run from the repository being checked. It can inspect any completed custom `NEXT_BUILD_DIR`; stale pre-SEO builds are expected to fail against the new source metadata.

Search indexes are rebuilt for all ten languages by the static `/search/[locale]` route. The generated-search checker verifies every article's content language, localized title/body queries, result fragments and index-size budget. Newly translated headings keep their previously published English fragments; article rendering, search and discussion targets share `lib/article-anchors.mjs`. Translation completeness, exact source structure and mathematical preservation are checked separately under `tests/translations`.

Primary references checked 2026-10-13:

- [Google: localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: descriptive snippets and description length](https://developers.google.com/search/docs/appearance/snippet)
- [Next.js 15: metadata API](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata)
- [Next.js: JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
- [Open Graph protocol](https://ogp.me/)
- [Schema.org: LearningResource](https://schema.org/LearningResource)
