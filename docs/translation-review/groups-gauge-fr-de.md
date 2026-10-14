# Curiosity 8: independent French and German review

Status: full semantic reading complete for both translations. All requested corrections were rechecked after the final translator edits; no remaining review blockers.

Reviewed SHA-256 snapshots:

- English: `57337f69bb93b3f84375708ba35c6b847af2e647ae6fc05ba7066241c17afa4e`.
- French: `cc4efee485c91429562e93cc85e00fc99a52c68392cab93c91aec4cf361ab193`.
- German: `8356274bb295be091a68e93d5163b9e76a0cea6d5a2892dcde6e1af17986c252`.

## Scope and method

Compared `content/translations/fr/curiosities/groups-lie-algebras-gauge-theory.mdx` and `content/translations/de/curiosities/groups-lie-algebras-gauge-theory.mdx` with the reviewed English article. This was a bilingual reading of the explanatory prose, metadata, captions and alt text, glossary, worked reasoning, and exercise answers, not merely equation equality. Particular attention went to sections 8.7–8.10 and 8.12–8.18.

An independent structural count found 20 major sections, 17 worked examples, 12 exercises, and seven images in each of English, French, and German. The release coordinator also runs complete structural and mathematical-expression parity checks; those complement this semantic review.

## Scientific meaning checked

Both translations retain the following distinctions and qualifications:

- Hermitian physics generators versus anti-Hermitian tangent matrices, including the corrected differentiation relation `dρ(i t_a)=iT_a`.
- Faithfulness versus irreducibility; defining/fundamental terminology; direct sums versus tensor products; real group dimensions versus complex representation dimensions.
- The SU(2) double cover of SO(3), the 2π sign and 4π return, and the distinction between spatial spin and the internal weak SU(2).
- Gauge redundancy versus physical global symmetry, including boundary qualifications; connections versus covariant adjoint tensors; local flatness versus global holonomy.
- The common covariant-derivative sign, inhomogeneous connection transformation, curvature commutator, positive nonlinear component term, and oriented-loop transport sign. Covariance is not translated as invariance.
- Chirality versus helicity; actual right-chiral matter fields rather than their left-chiral charge conjugates; all hypercharges with `Q=T3+Y`; the integer normalization `n=6Y`.
- Electroweak mixing, the photon not being the hypercharge field, tree-level mass relations, and the Higgs/gauge-redundancy qualification.
- The possible quotients by subgroups of Z6 without claiming that the maximal quotient is uniquely established. Anomaly examples remain examples, not a complete consistency proof.

All worked-example and exercise-answer meanings were retained. Sources remain attributed, and the references' explanatory annotations are translated. Localized prose, metadata, captions, alt text, and glossary are present throughout; no English fallback is represented as a translation.

## French findings

1. **Resolved and checked:** repeated `force du champ` / `force de champ` translated *field strength* too literally and could suggest a mechanical force. The revised `tenseur de champ` terminology, with corresponding gender and plural agreement, was checked in the introduction, gauge-theory sections, and exercise 7.
2. **Resolved and checked:** `couplages courants` for *running couplings* omitted scale dependence. The final text says `l'évolution des couplages avec l'échelle`.
3. **Resolved and checked:** the electroweak mass discussion now uses `au niveau des arbres` instead of `à l'ordre des arbres`.
4. **Resolved and checked:** the real norm is described as squared; the complex squared norm now explicitly says `positive ou nulle`, aligned with the English source clarification.

The other core terms, including `revêtement double`, `fibré vectoriel`, `connexion`, `représentation adjointe`, `chiralité`, and `hélicité`, are scientifically appropriate. No missing scientific paragraph or changed equation meaning was found.

## German findings

1. **Resolved and checked:** `v^T v` now appears as `quadrierte euklidische Länge`; `z†z` as `nichtnegatives Normquadrat`. This also prompted the corresponding English precision correction.
2. **Resolved and checked:** representation-context `eindeutig` was changed to `einwertig` for *single-valued*, avoiding confusion with uniqueness. The legitimate uniqueness language for logarithms and global groups was preserved.
3. **Resolved and checked:** the associativity explanation explicitly says that factor order must not change. The final lowercase `die Reihenfolge` after the semicolon was also checked.
4. **Resolved and checked:** changing feminine `Norm` to neuter `Normquadrat` is followed by the corrected pronoun in `Eine Matrix, die es erhält`.

German core terminology (`Lie-Klammer`, `Darstellung`, `treu`, `irreduzibel`, `Eichzusammenhang`, `Feldstärke`, `Chiralität`, `Helizität`, `Hyperladung`) preserves the mathematical and physical meaning. No missing scientific paragraph or changed equation meaning was found.

## Review limits

This is a focused bilingual scientific review, not formal verification or a claim of professional native-speaker copyediting. Browser layout, deployment, and complete automated parity are covered by separate release checks. Only review evidence was edited by this reviewer; locale corrections remain with their translators.
