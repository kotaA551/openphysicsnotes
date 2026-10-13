# Cycloidal pendulum and grouped discussions

Release base: `595e369d2f2a8bc289db35fda6354155334a4f82` (the completed curiosity expansion).

## Grouping rule

The user's final instruction is one panel at **3.1 / 3.2**, not one at 3.1.1 / 3.1.2. We use the existing, directly rendered **h2 numbered major sections**: `X.Y` in most chapters and Differential Geometry, and integer `1.`, `2.`, … in Chapter 1 and the shorter curiosities. All descendant headings, worked examples, and microsteps belong to that section through the next major heading. Existing misleveled `h2 11.3.2` stays in 11.3; `h2 4)` inside a worked proof is not a section boundary. A larger h1 division's introductory text joins its first h2 section. If a document has no regular numbered h2 sections, h2 (or its top-level heading depth when there is no h2) defines its small content sections. Across all 125 source editions this reduces 7,470 panels to 1,360 (about 82% fewer); every legacy scope remains reachable exactly once.

No heading text, numbering, IDs, search anchors, or source section boundaries are rewritten. The plugin only changes where the discussion component is inserted.

## Existing conversations

Each group lists its constituent original heading IDs once. One article-wide counts request supplies the sum shown on the collapsed panel and counts on the heading selector. On opening, one populated original location is selected (otherwise the parent target). The selector exposes every old location even if counts fail or are zero. Reading or paging makes one existing scoped request; there is no automatic N-way fetch of old panels. Selecting a location remounts its paged list, preventing stale replies from a different scope.

Replies retain the original section ID and parent ID. All new root questions go to the major section's heading ID, regardless of the selected legacy conversation. A confirmation survives the switch to that target. Legacy heading links still navigate to the original text; explicit `#discussion-<original-heading-id>` links also open the owning group at that conversation. Parent intros without previous direct discussion bodies are added as valid targets while every existing ID remains in the manifest.

API routes, origins, abuse controls, RLS, database functions and locale separation are unchanged. No database migration, external test post, row relabeling or comment deletion is needed or performed. Tests use in-memory PGlite and mocked fetch responses only.

## Original diagram

The two generated SVGs compare a circular pendulum and a Huygens suspension. The shared geometry has numeric labels; localized titles, legends, alt text and captions are supplied in the actual Chapter 2 editions: English, Japanese, Simplified Chinese, German and Brazilian Portuguese. Other locales retain their existing English fallback, with no invented translation.

Taking the suspension cusp as origin, with y measured downwards, the cheek contact is `C(q)=a(2q−sin(2q),1−cos(2q))`, while the bob is `B(q)=a(2q+sin(2q),3+cos(2q))`. Their difference is `4a cos(q)(sin(q),cos(q))`, parallel to the cheek tangent. The contact length `4a(1−cos(q))` plus free length `4a cos(q)` is `4a`. The bob curve's curvature center is the cheek contact: the cheek is its evolute and the bob curve its involute. The SVG plots these formulas directly rather than a hand-fitted visual approximation.

The signed bob arc length is `s=4a sin(q)`, and height above the bottom is `h=2a sin²(q)=s²/(8a)`. Hence the tangential gravitational force is `−mg s/(4a)` and the ideal period is `2π√(4a/g)`, within the taut-string accessible arc. The caption distinguishes the actual bob trajectory from the rolling-circle definition of a cycloid.

Academic checks:

- Jeremy Tatum, University of Victoria, [The Cycloidal Pendulum, section 19.9](https://phys.libretexts.org/Bookshelves/Classical_Mechanics/Classical_Mechanics_(Tatum)/19%3A_The_Cycloid/19.09%3A_The_Cycloidal_Pendulum): suspension, contact/free string and the involute construction.
- Laura Panizzi, [The Cycloid and the Tautochrone Problem](https://appliedmath.brown.edu/sites/default/files/fractional/22%20The%20Cycloid%20and%20the%20Tautochrone%20Problem.pdf), pp. 4–6, hosted by Brown Applied Mathematics: arc-length dynamics and amplitude-independent period.

## Verification

Independent source/geometry review identified and corrected the misleveled worked-step case and persistence of the new-post confirmation; final review found no remaining actionable issues. The 13 discussion/geometry tests passed, including all 125 source editions, real React interactions and in-memory database behavior. They cover legacy access, counts, one-level replies, pagination, empty/error/loading states and locale separation. The 13 existing search/SEO unit tests and the TypeScript check also passed. Production build and generated-page audits check panel density, heading IDs, formulas, search and SEO. Final public-page counts and release evidence are recorded in the delivery report.

The completed static audit passed all 190 article routes (including fallback routes), retaining all 7,470 legacy scope IDs. Across those routes, panels fall from 13,990 to 2,220. English and Japanese Chapter 3 each go from 74 panels to nine, at 3.1 through 3.9. All generated heading anchors remain intact, IDs are unique, formulas have no KaTeX errors, and all ten Chapter 2 routes include the two diagrams with descriptive localized or existing-fallback alt text. Search validation passed ten locales and 36 browser chunks; SEO validation passed 220 pages and 155 canonical sitemap URLs. The production build generated all 235 routes.

The generated cycloidal SVG was rasterized and visually inspected. Browser automation initialization failed twice (`trusted Node process exited unexpectedly`), and the recovery attempt failed with `cannot locate required Windows platform directory: HRESULT 0x80070003`, so browser screenshot/layout verification is not claimed.
