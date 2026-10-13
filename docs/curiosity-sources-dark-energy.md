# Dark energy expansion: source and derivation ledger

Research cutoff and link verification: **13 October 2026**. All ten editions use the same source links and twelve displayed equation blocks. Current observational claims are attributed to original collaboration papers. The historical/theoretical review below is explicitly identified as a review, not an independent measurement.

## Sources and claim boundaries

| Source | Version or publication date checked | Claim used in the article | Limits preserved in every edition |
| --- | --- | --- | --- |
| [Riess et al., Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant](https://arxiv.org/abs/astro-ph/9805201) | Submitted 15 May 1998; Astronomical Journal 116, 1009 | Standardized distant Type Ia supernovae motivated acceleration through the distance–redshift relation. | Inference within cosmological models, not real-time tracking of an individual galaxy; calibration, dust, evolution and selection require checks. |
| [Perlmutter et al., Measurements of Omega and Lambda from 42 High-Redshift Supernovae](https://arxiv.org/abs/astro-ph/9812133) | 1998 preprint; Astrophysical Journal 517, 565 (1999) | Independent supernova evidence for accelerated expansion. | This historical result does not identify a microscopic dark-energy field. |
| [Chevallier and Polarski, Accelerating Universes with Scaling Dark Matter](https://arxiv.org/abs/gr-qc/0009008) | 4 September 2000 | Origin of the two-parameter equation-of-state family. | A phenomenological fitting form rather than a physical theory; distances smooth time-dependent effects. The identifier is **gr-qc/0009008**, not the unrelated astro-ph/0009008. |
| [Linder, Exploring the Expansion History of the Universe](https://arxiv.org/abs/astro-ph/0208512) | 28 August 2002; Physical Review Letters 90, 091301 (2003) | CPL expansion-history parametrization and distance-based discrimination. | Its remote-future extrapolation is not justified; a canonical single scalar cannot generically realize a crossing of w = −1. |
| [Planck Collaboration, Planck 2018 results VI: Cosmological parameters](https://arxiv.org/abs/1807.06209) | Version 4, 9 August 2021 | Early acoustic scales and densities constrain late cosmology conditionally on the cosmological model. | CMB-inferred H0 is not a direct local expansion measurement; changing early physics can change the BAO ruler. No current tension significance is invented from this older analysis. |
| [Peebles and Ratra, The Cosmological Constant and Dark Energy](https://arxiv.org/abs/astro-ph/0207347) | Version 2, 20 November 2002; Reviews of Modern Physics 75, 559 (2003) | Scholarly theoretical context for vacuum energy, the cosmological-constant problem and dynamical proposals. | Explicitly a review. The article explains the renormalized total and cutoff dependence; it does not present a universal “120 orders” estimate as a measured prediction. |
| [LIGO/Virgo et al., Gravitational Waves and Gamma-rays from a Binary Neutron Star Merger: GW170817 and GRB170817A](https://arxiv.org/abs/1710.05834) | 2017 collaboration paper | Strong constraint on the relative propagation speed of gravity and light in the observed regime. | Removes many interactions subject to their assumptions; does not eliminate every modified-gravity theory. |
| [DESI Collaboration, DESI DR2 Results II: Measurements of Baryon Acoustic Oscillations and Cosmological Constraints](https://arxiv.org/abs/2503.14738) | Version 3, 9 October 2025; Physical Review D 112, 083515 | BAO alone are well described by flat ΛCDM; in CPL, BAO+CMB prefer evolution at 3.1σ, and adding alternative SN compilations gives 2.8–4.2σ. | Named dataset combinations and model family are essential. These comparisons are not a scalar-field discovery or a probability that dark energy evolves. |
| [DES Collaboration, Constraints on Dynamical Dark Energy from Multiple Probes in the Full Dark Energy Survey](https://arxiv.org/abs/2605.27221) | Version 2, 2 June 2026; first submitted 26 May 2026 | Geometry plus growth: CPL deviation 2.2σ for DES alone, 2.3σ with DESI DR2 BAO, and 3.0σ when primary CMB information is added. | Paper checked as a preprint. Overlapping datasets do not supply independent significances to multiply. |
| [DESI Collaboration, DESI DR2 Results IV: Alcock–Paczyński Measurements from the Lyman Alpha Forest and Cosmological Constraints](https://arxiv.org/abs/2607.27410) | Version 3, 4 August 2026; first submitted 29 July 2026 | Lyα full-shape AP measurement at effective z = 2.33 shifts the anchor toward ΛCDM. The updated paper reports 2.7σ CPL preference for DESI+CMB, 3.2σ with its SN dataset. | This newer result must accompany the 2025 discussion. It neither establishes evolution nor makes every combined dataset fully consistent with ΛCDM. |

The [DESI DR2 publications index](https://data.desi.lbl.gov/doc/papers/dr2/) and [30 July 2026 collaboration explanation](https://www.desi.lbl.gov/2026/07/30/new-desi-dr2-lyman-alpha-results-shed-light-on-dark-energy/) were also checked to locate and contextualize the original July paper. The numerical article claims cite the original paper itself.

## Original pedagogical derivations and assumptions

- Friedmann acceleration is stated both with explicit Λ and with Λ absorbed into the energy density, with a warning against double counting. The acceleration condition concerns total pressure and density, not a subdominant dark-energy component alone.
- The continuity equation is integrated for a homogeneous, separately conserved component. The constant-w dilution law and CPL exponential follow from that integral. The comoving-volume work relation illustrates local conservation without asserting a globally conserved energy in a general FLRW spacetime.
- The illustrative flat matter-plus-Λ model has Ωm0 = 0.30 and ΩΛ0 = 0.70, with radiation neglected. It gives q0 = −0.55, acceleration at a = (0.30/1.40)^(1/3) ≈ 0.598 (z ≈ 0.67), and density equality at a = (0.30/0.70)^(1/3) ≈ 0.754. These are model calculations, not fitted measurements.
- With the same present-day fractions and H0, H(z = 1)/H0 is approximately 1.761 for w = −1 and 1.860 for constant w = −0.8. The latter changes the dark-energy density by approximately 52% at that redshift but the total expansion rate by only 5.7%.
- The supernova calibration example follows the distance modulus definition: a 0.10 magnitude shift changes distance by 10^(0.10/5) − 1 ≈ 4.7%.
- Distance formulae assume spatial flatness, null-geodesic propagation and conserved photon number where distance duality is used. The BAO ruler is comoving and statistical, not a rigid individual object.
- The growth equation assumes linear, subhorizon, pressureless matter, GR, smooth dark energy and negligible radiation contributions. The growth-index expression is explicitly an approximation near ΛCDM. Gravitational slip may also arise from anisotropic stress within GR.
- The scalar-field energy and pressure assume a canonical, minimally coupled, homogeneous field with metric signature (−,+,+,+). If the field dominates, acceleration needs K < V/2; bounds −1 ≤ w ≤ 1 require K,V ≥ 0 and positive density. Tracking does not automatically remove tuning.

## Original SVGs

- `public/images/diagrams/dark-energy-deep-acceleration.svg`: an original numerical q(a) curve for the stated illustrative model, with distinct acceleration and density-equality markers. The figure does not depict observational data.
- `public/images/diagrams/dark-energy-deep-bao.svg`: an original schematic of transverse and radial BAO geometry. The transverse segment was corrected to be perpendicular to its midpoint sightline after independent scientific review.

Both assets contain only authored SVG geometry and mathematical labels, a title and description, and no scripts or external content. All ten article editions provide localized alt text and visible explanatory captions.

## Review and validation ownership

Independent scientific review checked the English derivations, numerical examples and all three 2025/2026 observational comparisons. Targeted bilingual review checked the translated assumptions, thresholds, equation-of-state caveats and status claims; the repository-wide independent review records its final extent. The root task owns full MDX/build, search, discussion-ID, metadata, sitemap and generated-HTML validation. This ledger does not substitute for those checks.

Article-level checks completed on 13 October 2026:

- All ten MDX bodies parsed successfully with remark-parse, remark-math and remark-mdx. Every parsed inline/display expression rendered with KaTeX `throwOnError: true` and `strict: 'error'` (1,498 expressions total).
- All editions have the same twelve displayed equation blocks, thirteen heading levels, ten unique external citation URLs and two local images with localized alternatives. Local image targets exist, localized descriptions are present, and no replacement characters were found.
- All thirteen existing heading texts/levels/order in each original EN/DE/pt-BR/JA/zh-CN edition match the isolated branch's baseline exactly.
- Both SVGs parse as XML, contain title/description elements, and contain no scripts, foreign objects, raster images, event handlers or external resource links.
- Both original SVGs were rasterized with the installed Sharp package and visually inspected at 880×440. Two minor label overlaps were corrected and the final raster previews rechecked. This is an asset inspection, not a browser or full-page rendering test.
- Scoped `git diff --check` passed; Git emitted only its configured LF-to-CRLF normalization notices.
- The independent reviewer confirmed no unresolved scientific or targeted bilingual finding after checking the final Simplified Chinese flux terminology. Japanese and Simplified Chinese received full semantic reads; the other translations received targeted checks of the main physical assumptions, derivations and dated observational claims.

Validation scripts and preview PNGs are outside the repository in the task workspace. No generated search/discussion manifests, shared source files, deployment state or database records were changed by the dark-energy worker.
