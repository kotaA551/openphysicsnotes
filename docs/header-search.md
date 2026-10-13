# Header section search

The header places search between the site name and language menu. Up to eight results show an article title, section heading and a contextual prose excerpt. Selecting a result follows the article URL and its existing heading ID. Introductory prose links to the existing `main-content` anchor. Native links support ordinary clicks, keyboard activation and opening in another tab.

On screens up to 760px wide, a compact search button expands an input across the header. Escape and the close button return focus to the search trigger; desktop Escape keeps focus in the input. Arrow keys select results, Enter follows the selected result (or the first result), and clear, outside pointer actions and focus leaving the search dismiss or reset it. Japanese, Chinese and Korean composition events suppress searching and navigation until composition finishes. Search state and the cached index are discarded when the locale changes.

## Content and privacy

`app/search/[locale]/route.ts` generates ten static JSON responses during `next build`. It uses `loadArticle`, so the source is exactly the displayed translated edition or the existing explicit English fallback. Each fallback result identifies English content in the interface language. All ten Navier–Stokes editions are supported as soon as their MDX files are present; availability for other articles continues to follow the repository's translation convention.

`lib/search/build.mjs` uses the same remark/rehype pipeline through `rehype-slug` as `ArticlePage`, including KaTeX. It reads the resulting heading IDs rather than guessing slugs. It extracts prose, including tables and callout children, and omits equations, code blocks, imports and executable MDX expressions. It does not evaluate component props or index raw MDX source.

Only the current locale's index is fetched, after nonempty input and a 160ms debounce. Queries stay in browser memory; they are not put in URLs, analytics events, storage, requests or a database. No search service is used. The component retains at most one prepared index. Each response is limited to 4 MiB, queries to 120 characters and twelve distinct terms, and results to eight. Build-time size failures deliberately require index splitting before further growth. HTTP caching requires revalidation on a fresh index fetch.

Normalization handles case, full-width characters, Latin diacritics and punctuation. CJK uses substring matching, retaining Japanese voiced marks and composed Korean syllables. Results require all terms, with heading matches ranked above article title and body matches. Context snippets preserve the original text and its language.

## Verification and maintenance

Run:

```sh
npm ci
npm run test:search
npm run typecheck
npm run build
node tests/search/generated-search-check.mjs
node --test tests/seo/metadata.test.mjs
node tests/seo/generated-seo-check.mjs
```

Search unit tests cover relevance, body-only matches, Unicode, bounds and actual rendered IDs, including repeated and mathematical headings. The jsdom test mounts the real React component and exercises keyboard, composition, clear, outside/focus dismissal, interrupted requests, repeated use, retry and locale resets. It is not OS-level IME or visual browser verification. The generated check verifies every search target against built HTML in every locale, translated/fallback provenance, static generation, byte budgets, header order, and absence of article index text in browser JavaScript chunks.

Rebuild after editing article headings, prose, translations, or the MDX rendering pipeline. Keep the extraction pipeline synchronized with `ArticlePage`; the rendered-ID regression detects drift. A failed index request offers a retry without disrupting article navigation.

No search styles animate; existing global reduced-motion handling controls anchor scrolling. Page titles, SEO metadata, language choice, article bodies, sidebar and discussion behavior are not changed by the feature.
