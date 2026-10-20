# Translation workflow

English is the source language. Shared interface text, topic titles, home, about, and privacy copy are translated into all supported languages in `lib/i18n.ts`. The site name stays Open Physics Notes.

## Article files

Add a complete translated MDX file at:

`content/translations/<locale>/<chapters|curiosities>/<original-slug>.mdx`

Supported non-English locale codes: `fr`, `de`, `it`, `es`, `pt-BR`, `zh-CN`, `zh-TW`, `ja`, `ko`.

Keep the original slug, equations, image paths, and component names. Translate prose, headings, image alt text, captions, table cells, book notes, and component text props. Include a translated `description` in YAML frontmatter (roughly 150 characters). Preserve the scientific meaning; review translations before publication. German uses standard German spelling and Brazilian Portuguese uses the `pt-BR` locale. No Portuguese content or regional convention existed in the source snapshot; Brazilian Portuguese was selected for this edition.

Missing translations explicitly show an English-content notice and mark the body `lang="en"`. These fallback URLs are noindex, canonicalize to the English article, and are omitted from the sitemap. Adding the file and rebuilding enables the translated page and sitemap entry. Hreflang should list only complete translations.

The 65 formerly fallback editions retain their published English heading fragments through `lib/article-anchor-ids.mjs` and `lib/article-anchors.mjs`. Article rendering, search indexing and the discussion manifest use this same mapping. Keep heading counts and order aligned with the source; do not regenerate these permanent identifiers from translated heading text. Previously translated editions retain their original identifiers.

Descriptive words inside mathematical `\text{...}` labels may be translated through the reviewed map in `tests/translations/math-annotations.json`. Symbols, units, operators and conventional subscripts remain unchanged. Document any actual source correction separately and synchronize it across affected editions.

Run `node node_modules/next/dist/bin/next build` to validate all MDX and routes, and `node node_modules/typescript/bin/tsc --noEmit` for type checking. The site uses Next's native sitemap and robots routes; the older next-sitemap config is no longer used.

Before building, run `node tests/translations/coverage.mjs ../evidence/coverage.json --require-complete`, `node tests/translations/source-check.mjs`, `node tests/translations/preservation-check.mjs` and `node scripts/discussion-manifest.mjs`. The source checks compare paragraph/list/table structure, formulas, heading levels, image references, link targets, code and protected identifiers; a separate bilingual review is still required because structural equality alone does not establish translation quality. After the build, run the generated SEO, search, discussion and translation-content checks and inspect desktop/mobile pages.

Language preferences are local to the browser. Same as device follows the browser's preferred supported language, falling back to English. Explicit localized URLs remain shareable. No external translation service is called.

## Current coverage

- Shared UI, homepage, About, Privacy, discussion labels and all 20 topic titles: all 10 supported languages.
- All 10 languages now contain 12 complete chapters and 8 complete curiosities: 200 article editions and zero English fallback editions. The completion adds 65 editions in French, Italian, Spanish, Traditional Chinese and Korean.
- The Navier–Stokes curiosity includes the research status checked on 13 October 2026. The five expanded curiosities (black-hole information, dark energy, dark matter, loop quantum gravity and string theory), Differential Geometry, and Groups, Lie algebras and gauge theory are also available in every language.
- All 65 new French, Italian, Spanish, Traditional Chinese and Korean editions received full independent source-target prose review, covering 31,425 target prose rows (6,285 per language). No new edition remains limited to focused review. These reviews do not certify every scientific statement or historical quotation.
- German and Portuguese prose, metadata, headings, tables and image alternatives received complete source-target semantic review; the original seven curiosities also received independent bilingual review. Other chapters received translator review, with additional independent review of chapter 10 sections 11–13. This does not certify independent derivation of every scientific statement.
- The eighth curiosity received independent mathematical review of the English master and focused independent bilingual review of every translated edition. Findings, corrections and final source hashes are recorded in `docs/groups-gauge-math-review.md` and `docs/translation-review/groups-gauge-*.md`; this is not formal verification.
- Confirmed source corrections were synchronized across affected EN/JA/zh-CN/de/pt-BR articles. Remaining convention and historical-attribution issues are recorded in the local edition review; those internal review artifacts are not part of the public source release.
- The completion review restores existing translation omissions and localizes descriptive mathematical labels. Three independently checked oscillator formulas and two prose clarifications in chapter 7 were synchronized across affected editions. See [the source-correction record](../../docs/translation-review/completion-source-corrections.md) for the derivation and retained editorial questions.
- The redundant first Black Hole Information Paradox self-link was removed from the MDX source. The page title, real section headings and their anchors remain.
- Existing image files and slugs are unchanged. The five expanded curiosities add original SVG diagrams with language-neutral mathematical symbols, localized alt text and visible captions. Original artwork is retained where useful. The eighth curiosity adds original mathematical SVG diagrams with localized alternatives and captions.

Portuguese discussion posting requires the database locale constraint to accept `pt-BR`. Migration `supabase/migrations/202610130001_portuguese_locale.sql` inspects the current constraint and adds `pt-BR` while retaining existing locales, comments and security settings. Verify the production project before running it and save the returned recovery SQL. Re-running the migration is a no-op. Website deployment does not execute this SQL migration.
