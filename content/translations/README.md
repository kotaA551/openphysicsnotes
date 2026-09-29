# Translation workflow

English is the source language. Shared interface text, topic titles, home, about, and privacy copy are translated into all supported languages in `lib/i18n.ts`. The site name stays Open Physics Notes.

## Article files

Add a complete translated MDX file at:

`content/translations/<locale>/<chapters|curiosities>/<original-slug>.mdx`

Supported non-English locale codes: `fr`, `de`, `it`, `es`, `zh-CN`, `zh-TW`, `ja`, `ko`.

Keep the original slug, equations, image paths, and component names. Translate prose, headings, image alt text, captions, table cells, book notes, and component text props. Include a translated `description` in YAML frontmatter (roughly 150 characters). Preserve the scientific meaning; review translations before publication. The Japanese dark-matter article is the first complete article translation.

Missing translations explicitly show an English-content notice and mark the body `lang="en"`. These fallback URLs are noindex, canonicalize to the English article, and are omitted from the sitemap. Adding the file and rebuilding enables the translated page and sitemap entry. Hreflang should list only complete translations.

Run `node node_modules/next/dist/bin/next build` to validate all MDX and routes, and `node node_modules/typescript/bin/tsc --noEmit` for type checking. The site uses Next's native sitemap and robots routes; the older next-sitemap config is no longer used.

Language preferences are local to the browser. Same as device follows the browser's preferred supported language, falling back to English. Explicit localized URLs remain shareable. No external translation service is called.

## Current coverage

- Shared UI, homepage, About, Privacy, and all 19 topic titles: all 9 languages.
- Full article translations: Japanese / curiosities / dark-matter; Japanese / chapters / 8-Quantum-field-theory (all sections, including 8.2A–8.2C).
- Full article translation: Simplified Chinese / chapters / 1-Newton-mechanics (all 20 sections and epilogue; source calculation discrepancies are noted in the translation).
- Full article translation: Simplified Chinese / chapters / 2-Oscillations-and-waves (all 12 sections and closing remarks).
- Full article translations: Simplified Chinese / chapters / 3-Thermodynamics (all 9 sections), 4-Electromagnetism (all 9 sections), and 5-Relativity (all 8 sections; the pion-production threshold discrepancy is noted). Inline math delimiters are normalized for rendering without changing the formulas.
- Full article translations: Simplified Chinese / chapters / 6-Early-quantum-theory (all 9 sections), 7-Quantum-mechanics (all 6 numbered sections), and 8-Quantum-field-theory (all 10 sections and supplements 8.2A–8.2C). Equations and image paths are preserved; inline math delimiters are normalized for rendering. Translator notes clarify source discrepancies in the Gaussian uncertainty discussion, infinite-well position spread, and axial-vector time reversal.
- Full article translation: Japanese / curiosities / differential-geometry (all 7 parts, including the Schwarzschild derivation; all 98 math expressions and 62 headings preserved). Unsourced historical quotations are presented as anecdotes rather than verified direct quotations.
- Remaining articles: original English, with translations to be added gradually.
- Text embedded inside existing raster images still belongs to the original image; supply localized image assets and update the translated MDX when needed.
