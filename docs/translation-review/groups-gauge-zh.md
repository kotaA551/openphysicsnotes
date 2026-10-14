# Chinese translation review: groups, Lie algebras and gauge theory

Review completed: 2026-10-14. Review agent: `translate_es`, independent of the Chinese translation author (`translate_zh`). The semantic review was completed before a host outage; the two outstanding heading corrections, validation reruns and this record were completed after reconnection. The completed review was retained rather than restarted.

## Files and method

- English reference: `content/curiosities/groups-lie-algebras-gauge-theory.mdx`.
- Simplified Chinese: `content/translations/zh-CN/curiosities/groups-lie-algebras-gauge-theory.mdx`.
- Traditional Chinese: `content/translations/zh-TW/curiosities/groups-lie-algebras-gauge-theory.mdx`.

Both Chinese versions received a bilingual semantic reading against the independently math-reviewed English master, covering sections 8.1–8.20, title and description, tables, image alt text and captions, glossary, sources and all twelve exercise answers. This was a content and terminology review, not merely a comparison of equations or a simplified/traditional character conversion. Automated checks separately verified mathematical and structural parity.

## Coverage and conclusions

| Area | Meaning checked in both translations | Result |
| --- | --- | --- |
| Foundations, 8.1–8.6 | Group axioms, operation order, actions and faithful kernels, active/passive distinction, inner products, real group dimension versus complex representation dimension, and rank | Preserved |
| Norm precision, 8.4 | The real expression is squared Euclidean length; the complex expression is the nonnegative squared norm | Both source corrections already present and retained |
| Lie theory, 8.7–8.9 | Actual tangent matrices are anti-Hermitian; physics generators are Hermitian; exponential surjectivity is not claimed for arbitrary Lie groups; BCH is local; SU(2) and SO(3) differ globally, with a double cover and a relative spinor sign | Preserved |
| Representations, 8.10–8.11 | Defining versus irreducible, direct sum versus tensor product, adjoint dimension, real tangent directions versus complex spaces, color versus flavor, and gluons not being literal quark–antiquark bound states | Preserved |
| Gauge construction, 8.12–8.15 | Gauging is an additional physical choice; internal fibers are not spacetime tangent spaces; redundancy and boundary qualifications; the connection's inhomogeneous term; covariance versus invariance; loop orientation, local flatness and global holonomy; nonabelian self-interaction | Preserved |
| Standard Model, 8.16–8.17 | Chirality versus helicity; actual right-chiral fields; color-first representation labels; Q = T3 + Y convention; integer normalization n = 6Y; right-chiral hypercharge and Z couplings; 8 + 3 + 1 species rather than polarizations; photon mixing; gauge-fixed Higgs language and tree-level limits | Preserved |
| Global structure and limits, 8.18 | Quotient by a subgroup of Z6 is compatible with the displayed matter, rather than uniquely determined by it; anomaly example is not a complete proof; Yukawa values and wider dynamics remain unspecified | Preserved |
| Exercises and reference material, 8.19–8.20 | All twelve questions and answers retain their reasoning, including representation descent, pure gauge potentials, oriented loops, Weyl counting and both Yukawa tests; captions, glossary, source descriptions and internal links are localized | Preserved |

No material semantic translation errors were found. No formulas were changed during this review.

Taiwan usage was assessed without requiring mainland terminology: `直行/橫列`, `純量`, `因次`, `微中子`, `正規化`, `包立` and `么正` are used coherently in the Traditional Chinese text. The variants retain their own wording while describing the same mathematical objects. The holonomy term includes its English name and a local definition in both versions.

## Finding and resolution

One wording precision issue was found in the section 8.4 heading. The English says “preserved quantities”; translating this as conservation can suggest conservation during time evolution rather than invariance under the transformations being discussed.

| Locale | Original heading | Resolved heading |
| --- | --- | --- |
| zh-CN | `8.4 矩阵、复数与守恒的量` | `8.4 矩阵、复数与保持不变的量` |
| zh-TW | `8.4 矩陣、複數與守恆的量` | `8.4 矩陣、複數與保持不變的量` |

After the host reconnected, a read confirmed the interrupted patch had not applied. Both headings were then changed successfully. No other Chinese content changes were necessary. The changed heading anchors must be reflected in the integration-generated discussion and search data; those generated outputs belong to the main integration workflow.

## Validation after the final corrections

Both commands exited successfully and returned `result: passed` with an empty errors list:

```text
node tests/curiosities/groups-gauge-check.mjs --locale zh-CN
node tests/curiosities/groups-gauge-check.mjs --locale zh-TW
```

| Locale | Major sections | Headings | Display equations | Math expressions | Paragraphs | Figures | Content characters |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| en | 20 | 50 | 70 | 618 | 227 | 7 | 62811 |
| zh-CN | 20 | 50 | 70 | 618 | 227 | 7 | 29764 |
| zh-TW | 20 | 50 | 70 | 618 | 227 | 7 | 29789 |

The checks also passed source-table, formula, figure-path, external-URL and localized internal-link parity, including validation of referenced articles and applicable anchors. All seven shared diagram assets were found. These locale checks do not stand in for the final full build, generated-manifest check, production verification or visual rendering review.

## File evidence

SHA256 values captured after the heading corrections:

| File | SHA256 |
| --- | --- |
| `content/curiosities/groups-lie-algebras-gauge-theory.mdx` | `57337F69BB93B3F84375708BA35C6B847AF2E647AE6FC05BA7066241C17AFA4E` |
| `content/translations/zh-CN/curiosities/groups-lie-algebras-gauge-theory.mdx` | `36B87006B380F7A06D9417989162DA627A519415A3FC89B8CA4F5BC68A7EF9DF` |
| `content/translations/zh-TW/curiosities/groups-lie-algebras-gauge-theory.mdx` | `89E7E1DDCF142E287DF4B1225DC39B4D5B22CA0A4D14194535EFC98F77B6D2C3` |

## Retained Spanish completion evidence

The same agent completed `content/translations/es/curiosities/groups-lie-algebras-gauge-theory.mdx` before the outage. Its final locale parity run passed after the squared-length and nonnegative-squared-norm precision corrections: 20 major sections, 50 headings, 70 display equations, 618 math expressions, 227 paragraphs and seven figures, with table, URL and localized-link checks passing. The independent `english_core` reviewer subsequently reported no material corrections after reviewing all twenty Spanish sections, metadata, captions, glossary and all twelve answers. This is a separate review from the Chinese review documented above.

The Spanish file was not edited during this recovery task. Its recovery-time SHA256 is `0188B41FE1127F4E6CCB98FF1546314E8E4CE6EECF216B2596FF7CCFEB8B3DD8`.

## Limits

This record documents bilingual semantic review and automated content checks. It is not formal proof verification or specialist native-language certification. The reviewer did not inspect browser typography, responsive layout or production pages. Those checks and deployment remain with the main integration task. There are no outstanding Chinese translation issues from this review.
