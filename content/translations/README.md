# Translation workflow

English is the source language. Shared interface text, topic titles, home, about, and privacy copy are translated into all supported languages in `lib/i18n.ts`. The site name stays Open Physics Notes.

## Article files

Add a complete translated MDX file at:

`content/translations/<locale>/<chapters|curiosities>/<original-slug>.mdx`

Supported non-English locale codes: `fr`, `de`, `it`, `es`, `pt-BR`, `zh-CN`, `zh-TW`, `ja`, `ko`.

Keep the original slug, equations, image paths, and component names. Translate prose, headings, image alt text, captions, table cells, book notes, and component text props. Include a translated `description` in YAML frontmatter (roughly 150 characters). Preserve the scientific meaning; review translations before publication. German uses standard German spelling and Brazilian Portuguese uses the `pt-BR` locale. No Portuguese content or regional convention existed in the source snapshot; Brazilian Portuguese was selected for this edition.

Missing translations explicitly show an English-content notice and mark the body `lang="en"`. These fallback URLs are noindex, canonicalize to the English article, and are omitted from the sitemap. Adding the file and rebuilding enables the translated page and sitemap entry. Hreflang should list only complete translations.

Run `node node_modules/next/dist/bin/next build` to validate all MDX and routes, and `node node_modules/typescript/bin/tsc --noEmit` for type checking. The site uses Next's native sitemap and robots routes; the older next-sitemap config is no longer used.

Language preferences are local to the browser. Same as device follows the browser's preferred supported language, falling back to English. Explicit localized URLs remain shareable. No external translation service is called.

## Current coverage

- Shared UI, homepage, About, Privacy, discussion labels and all 19 topic titles: all 10 supported languages.
- Full article editions: English, Japanese, Simplified Chinese, German and Brazilian Portuguese, each containing all 12 chapters and 7 curiosities.
- French, Italian, Spanish, Traditional Chinese and Korean article URLs continue to show explicit English fallbacks.
- German and Portuguese prose, metadata, headings, tables and image alternatives received complete source-target semantic review; all seven curiosities also received independent bilingual review. Other chapters received translator review, with additional independent review of chapter 10 sections 11–13. This does not certify independent derivation of every scientific statement.
- Confirmed source corrections were synchronized across affected EN/JA/zh-CN/de/pt-BR articles. Remaining convention and historical-attribution issues are recorded in the local edition review; those internal review artifacts are not part of the public source release.
- The redundant first Black Hole Information Paradox self-link was removed from the MDX source. The page title, real section headings and their anchors remain.
- Original image files and slugs are unchanged. Any text embedded inside the original image pixels or SVG artwork is retained; translated alt text accompanies each image.

Portuguese discussion posting requires the database locale constraint to accept `pt-BR`. Migration `supabase/migrations/202610130001_portuguese_locale.sql` inspects the current constraint and adds `pt-BR` while retaining existing locales, comments and security settings. Verify the production project before running it and save the returned recovery SQL. Re-running the migration is a no-op. Website deployment does not execute this SQL migration.
