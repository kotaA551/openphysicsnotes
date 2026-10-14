# Curiosity 8: groups, Lie algebras and gauge theory

## Content and scope

This is a new eighth Curiosity, `groups-lie-algebras-gauge-theory`, appended after Differential Geometry. It does not replace or edit the main Quantum Field Theory chapter. The release starts from production commit `5f321dd37b25a6603cef4ff48d626bcc1daa6d01`.

The English master has 20 numbered major sections, 17 worked examples, 12 answered exercises, a glossary, prerequisites, a reading map, and a primary-source bibliography. It follows group axioms and actions through matrices, Lie groups/algebras, representations, connections/curvature, and the Standard Model. It uses Hermitian physics generators, `D=partial-igA`, and `Q=T3+Y` consistently. Global gauge-group quotients, chirality versus helicity, gauge redundancy, and the limits of the derivation are explicitly qualified.

Independent mathematical review and source checks are recorded in [groups-gauge-math-review.md](groups-gauge-math-review.md). This is an educational and mathematical review, not formal proof verification.

## Original figures

Seven original SVGs are reproducible with `node scripts/generate-groups-diagrams.mjs`: triangle composition, rotations/phase, tangent/exponential, the SU(2) cover, representation spaces, connection/curvature, and Standard Model mixing. They contain mathematical labels, an accessible title and description, and no executable or external content. Each language supplies its own image alternative and visible caption.

All seven were parsed as XML, checked for mathematical consistency, rasterized at 840px and 390px, and visually inspected. Axis/coordinate and arrow/label overlaps were corrected. Opaque light panels maintain contrast independently of the surrounding page theme. The SU(2) diagram is a parameter track, not a drawing of the full three-dimensional group manifold; the curvature graphic separates spacetime and fibers.

## Integration

The shared catalogue and ten localized topic titles drive navigation, routes, search, SEO and the sitemap. Complete localized MDX files enable their own content language, self-canonical URLs, reciprocal ten-language hreflang plus English x-default, and LearningResource JSON-LD through the existing implementation. The discussion manifest is regenerated using the existing script. Major 8.X sections retain the existing grouped-panel behavior; no database migration or discussion API change is needed.

The new complete article brings the site to 20 articles, 135 actual language editions and 65 explicitly marked fallback pages for older articles. Expected output includes 200 article routes, 230 ordinary SEO pages and 165 canonical sitemap URLs.

## Verification workflow

The dedicated source check parses every edition, renders every mathematical expression with strict KaTeX, compares all display equations and mathematical-expression multiplicities, heading hierarchy, tables, images and source URLs, verifies internal links/anchors, and rejects duplicated English prose or fallback content. Its rendered mode verifies the twenty grouped discussions, actual heading targets, localized body language, search results and SEO.

```sh
node scripts/discussion-manifest.mjs
node tests/curiosities/groups-gauge-check.mjs
node --test tests/search/*.test.mjs tests/discussions/*.test.mjs tests/seo/metadata.test.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
node tests/curiosities/groups-gauge-check.mjs --dist .next
node tests/curiosities/source-check.mjs
node tests/curiosities/generated-check.mjs
node tests/seo/generated-seo-check.mjs
node tests/search/generated-search-check.mjs
node tests/discussions/generated-check.mjs
```

After the exact commit's Vercel Production deployment succeeds, the public check compares the entire displayed article, anchors, discussion panels, localized alternatives, metadata, JSON-LD and search indexes against the tested build. It also hashes all seven served SVGs and verifies sitemap inclusion:

```sh
node --use-system-ca tests/curiosities/groups-gauge-public-check.mjs EXACT_RELEASE_SHA
```

Browser automation initialization failed before and after host reconnection with `trusted Node process exited unexpectedly`. Browser layout screenshots and interactive browser testing are therefore not claimed. SVG raster inspection and source/rendered/public checks are separate evidence.

## Completed source and translation checks

All ten full editions passed the final source audit on 14 October 2026: each contains 20 major sections, 50 heading anchors, 70 display equations, 618 total mathematical expressions, 227 paragraphs and seven figures. Table structure, source URLs, localized internal links and anchor targets match the reviewed source; there are no fallback translations or unreplaced placeholders. All seven SVGs passed the XML and accessibility checks.

Independent bilingual review evidence and final source hashes are in `docs/translation-review/groups-gauge-{fr-de,it,pt-BR,es-ko,zh,ja}.md`. The review corrections clarify squared norms, single-valued representations, field-strength tensors, running couplings, tree-level approximations and Japanese trace-index terminology. No unresolved mathematical or semantic review findings remain.

Review hashes identify the reviewed working files. Git's CRLF/LF normalization can change a raw file hash without changing the reviewed text; the release application preserves existing canonical newline conventions and checks normalized content when merging.

TypeScript passed with `--noEmit --incremental false`. The final search, discussion and SEO regression run passed all 26 tests, including all 135 actual editions, 7,970 section scopes and 1,560 grouped panels. The discussion manifest contains 7,980 allowed section/group targets; the existing article entries are preserved and ten new entries are added.

## Completed production-build checks

The production build passed and generated all 245 routes. Generated-output audits passed for the ten new editions (20 discussion panels and 50 heading anchors each), all 230 ordinary SEO pages and 165 canonical sitemap URLs, all ten search indexes and 36 browser JavaScript chunks, all 200 article routes' discussion panels, and 70 existing Curiosity pages with 1,170 legacy anchors. The discussion audit preserved all 7,470 original section IDs. A separate baseline comparison confirmed that all 125 previous manifest entries and their 7,480 section/group targets are unchanged, with only the ten new article entries added.

No preexisting article, dependency manifest, lockfile, database schema or permission setting is changed. The main Quantum Field Theory Chapter 8 remains intact. The release contains 37 scoped files; canonical application uses backups, a three-way merge for preexisting local differences, and unchanged-hash checks for unrelated files.

The exact commit's Production deployment and served content are checked after publication using `groups-gauge-public-check.mjs`; the commit-specific result is saved with the release execution evidence so it cannot claim success before deployment.

The first local build compiled successfully but its dependency probe encountered sandbox `EPERM` errors on `realpath`, causing Next to misidentify installed TypeScript packages. That attempt was stopped. All dependency files stayed unchanged; the same installed versions resolved correctly outside that filesystem restriction. The final build runs with CI mode to prevent automatic dependency installation.
