# Loop quantum gravity: source and review ledger

Scope: `loop-quantum-gravity` only. Research cutoff and verification date: **2026-10-13**. English source and complete editions in ja, zh-CN, zh-TW, de, pt-BR, fr, it, es and ko. No external translated text was copied; the instructional prose, examples and SVG diagrams are original.

## Verified primary sources

| Source | Verified URL | What it supports and what it does not |
| --- | --- | --- |
| Ashtekar & Lewandowski, *Background Independent Quantum Gravity: A Status Report* (2004) | https://arxiv.org/abs/gr-qc/0404018 | Authors' foundational account of background-independent quantization and kinematics; not a 2026 observational status report. |
| Barbero, *Reality Conditions and Ashtekar Variables: a Different Perspective* (1994/1995) | https://arxiv.org/abs/gr-qc/9410013 | Real Lorentzian connection variables; distinguished from the original complex self-dual variables. |
| Holst, *Barbero's Hamiltonian derived from a generalized Hilbert-Palatini action* (1995/1996) | https://arxiv.org/abs/gr-qc/9511026 | Canonical variables and the action underlying the real-connection formulation. |
| Thiemann, *Quantum Spin Dynamics (QSD)* (1996/1998) | https://arxiv.org/abs/gr-qc/9606089 | A concrete Hamiltonian-constraint proposal; cited without asserting unique, fully established phenomenology. |
| Lewandowski, Okołów, Sahlmann & Thiemann, *Uniqueness of diffeomorphism invariant states on holonomy-flux algebras* (2005/2006) | https://arxiv.org/abs/gr-qc/0504147 | Representation uniqueness under the theorem's assumptions, not uniqueness of every quantum-gravity theory or its dynamics. |
| Ashtekar & Lewandowski, *Quantum Theory of Gravity I: Area Operators* (1996/1997) | https://arxiv.org/abs/gr-qc/9602046 | Kinematic area operator and discrete spectrum. Simple puncture formula restricted to transverse intersections away from vertices. |
| Dittrich & Thiemann, *Are the spectra of geometrical operators in Loop Quantum Gravity really discrete?* (2007) | https://arxiv.org/abs/0708.1721 | Why kinematic discreteness alone does not settle spectra of fully physical relational observables. |
| Ashtekar & Lewandowski, *Quantum Theory of Geometry II: Volume operators* (1997/1998) | https://arxiv.org/abs/gr-qc/9711031 | Vertex action, regularization choices and volume construction; edge spins alone are not asserted to diagonalize all volume operators. |
| Engle, Livine, Pereira & Rovelli, *LQG vertex with finite Immirzi parameter* (2007/2008) | https://arxiv.org/abs/0711.0146 | EPRL connection between spin-foam and LQG boundary descriptions; not a proof of the full continuum dynamics. |
| Barrett, Dowdall, Fairbairn, Gomes & Hellmann, *Asymptotic analysis of the EPRL four-simplex amplitude* (2009) | https://arxiv.org/abs/0902.1170 | Euclidean EPRL large-spin asymptotics for suitable nondegenerate geometric boundary data contain Regge action; explicitly not generalized to all amplitudes or Lorentzian models. |
| Ashtekar, Pawlowski & Singh, *Quantum Nature of the Big Bang: Improved dynamics* (2006) | https://arxiv.org/abs/gr-qc/0607039 | Flat homogeneous isotropic massless-scalar LQC, improved dynamics and model bounce. |
| Ashtekar, Corichi & Singh, *Robustness of key features of loop quantum cosmology* (2007/2008) | https://arxiv.org/abs/0710.3565 | Exactly solvable reduced LQC and stronger quantum-state results, distinguished from the displayed effective calculation and from full LQG. |
| Assanioussi & Livine, *Elementary blocks of Loop Quantum Gravity*, v2 dated 2026-09-02 | https://arxiv.org/abs/2601.21644v2 ; https://arxiv.org/html/2601.21644v2 | Current primary research on classical Hamiltonian dynamics of small candy graphs. Authors expressly defer the detailed quantum regime. Used as a bounded progress example, not an empirical detection or completed theory. |

All cited URLs were opened or resolved through primary arXiv records on the verification date. The 2026 paper's full HTML introduction and technical setup were inspected. Search hits not matching the intended title, popular summaries, and unrelated arXiv IDs were discarded and are not cited. No claim of an exhaustive survey of every 2026 preprint is made.

## Original derivations and qualifications

- Defined the real Ashtekar–Barbero variables, nondegenerate triad assumption, time gauge, c=1, positive real gamma, vacuum and zero cosmological constant where appropriate.
- Vector constraint is described as generating spatial diffeomorphisms up to Gauss; Hamiltonian formula has its irrelevant nonzero overall normalization explicitly suppressed.
- Regular classical phase-space count: 18 minus 2 times 7 equals 4, or two local configuration degrees of freedom.
- Worked puncture sum: sqrt(3)/2 + sqrt(2) = 2.280238966, with admissibility of the rest of the network required.
- Independently differentiated effective Friedmann plus continuity equations: dot H = -4 pi G (rho+P)(1-2rho/rho_c). A bounce requires the stated positive rho+P condition, not only H=0.
- Independently substituted the massless-scalar effective solution a/a_B=(1+t²/t_B²)^(1/6), rho/rho_c=1/(1+t²/t_B²), t_B^(-2)=24 pi G rho_c. It is explicitly an exact solution of these effective equations, not an exact full-LQG solution.
- The normalizations of a_B, the Immirzi parameter, model dependence, kinematics versus dynamics, continuum versus large-spin limits, and absence of observational confirmation in the cited results are explicit.
- Removed blanket “QM demands every field quantized” and “string theory is always background dependent” assertions.

## Assets and localization

Original repository-native SVGs:
- `public/images/diagrams/lqg-deep-area.svg`: two transverse punctures with neutral mathematical labels; circular markers are punctures, not graph vertices.
- `public/images/diagrams/lqg-deep-bounce.svg`: two accurately sampled dimensionless curves from the effective solution. No empirical data implied.

Both contain title/description metadata, no scripts, no external resources, and no copied artwork. Every edition has localized alt text and visible captions. All thirteen display equations and all primary links are shared semantically across editions. Existing nine headings (including the Ashtekar subsection) were retained verbatim and in order in the five previously complete editions; four additional explanatory subsections have stable localized titles.

## Review and validation

Independent scientific review re-derived the area and effective-bounce calculations and requested the explicit “Euclidean” qualification for the cited EPRL asymptotic result; that change was applied to all editions. The reviewer completed semantic or high-risk passage review of all ten editions and scientific source inspection of both SVGs, with no remaining content blocker. The Traditional Chinese encoding issue found during drafting was repaired and independently rechecked; French elision and Spanish terminology corrections were also verified.

Local article checks completed successfully after reconnection:

- All ten MDX files compile with remark-math, remark-gfm, rehype-katex and rehype-slug.
- KaTeX with throwOnError and strict error handling accepts every math expression: 82 each in EN/JA, 81 each in the other editions (a repeated inline parameter reference accounts for the count difference).
- All editions have the same 13 display equations, 13-heading level structure, 13 primary-source URLs and two existing image paths with localized alternatives. Descriptions are present.
- Existing heading strings remain an ordered subsequence of the updated headings for all previously present editions checked against Git HEAD.
- No untranslated equation placeholders, Unicode replacement characters or question-mark corruption remain in the translated articles.
- Both SVGs parse as XML and contain title/description metadata, with no scripts, foreign objects, embedded external images, event handlers or external resource attributes.
- Both SVGs were rendered to PNG with the installed sharp library and visually inspected at native size. Labels, curves, puncture markers and equation text are legible without clipping or overlap. Preview PNGs are outside the repository; this is an asset-render check, not a browser check.

Site-wide search/discussion regeneration, metadata, sitemap, full build, type checks, and browser checks are owned by the coordinating agent; no claim about their outcome is made here.
