# Curiosity 8: independent mathematical review

Status: full English mathematical review complete; all 20 major sections, 17 worked examples, 12 exercise answers, and seven diagram generators reviewed. All requested corrections resolved and checked. No remaining mathematical blockers; English cleared for translation.

Reviewed English SHA-256 after the norm-wording clarification: `57337f69bb93b3f84375708ba35c6b847af2e647ae6fc05ba7066241c17afa4e`.

Scope: `content/curiosities/groups-lie-algebras-gauge-theory.mdx`. This is an independent mathematical and pedagogical review, not formal proof verification.

## Primary references checked

- Pavel Etingof, MIT, [18.745: Lie Groups and Lie Algebras I](https://math.mit.edu/~etingof/lnlg.pdf): §2 Lie groups, example 2.13 covering SU(2) to SO(3), §3 actions, §5.3 exponential, §6–7 Lie bracket and BCH, §9 representations. The exponential is a local diffeomorphism near zero; the Lie algebra alone does not specify a group's global form. SU(2) acts on traceless Hermitian matrices by conjugation with kernel `{I,-I}`.
- David Tong, Cambridge, [The Standard Model, chapter 1](https://www.davidtong.org/pdfs/teaching/standard-model/standardmodel1.pdf): §1.3 gauge invariance and Yang–Mills. This uses Hermitian physics generators and the minus-sign convention for the covariant derivative. Care is required when comparing to anti-Hermitian mathematical Lie algebras.
- David Tong, Cambridge, [Gauge Theory, chapter 2](https://www.davidtong.org/pdfs/teaching/gauge-theory/gauge2.pdf): §2.1 dimensions and generator normalization; §2.1.3 Wilson lines/loops. That source often absorbs the coupling into the gauge potential, unlike the proposed article's explicit `g` convention. Its SU(N) fundamental generators obey `tr(T_a T_b)=δ_ab/2`.
- David Tong, Cambridge, [The Standard Model, chapter 5](https://www.davidtong.org/pdfs/teaching/standard-model/standardmodel5.pdf): §5.1 fermion assignments with `Q=T3+Y`; §5.1.6 allowed global forms; §5.2 electroweak breaking. The usual local particle content is compatible with quotients by subgroups of Z6; this does not establish one unique experimentally determined global gauge group.
- Particle Data Group, [Electroweak Model and Constraints on New Physics, 2025 update](https://pdg.lbl.gov/2025/reviews/rpp2025-rev-standard-model.pdf): §10.1, especially equations 10.3 and 10.5, independently checks the neutral-boson mixing and tree-level masses. PDG uses doubled hypercharge, `Q=T3+Y_PDG/2`; do not copy its hypercharge normalization into the article unchanged. It distinguishes weak/flavor and mass bases and identifies the minimal model's missing neutrino-mass mechanism.
- David Tong, [Line Operators in the Standard Model](https://arxiv.org/abs/1705.01853): original research reference for the global-form subtlety, if a more detailed advanced reference is wanted.
- Hugh Osborn, Cambridge, [Group Theory Lecture Notes](https://www.damtp.cam.ac.uk/user/ho10/GNotes.pdf): chapters 1–3 give finite groups, matrix groups, representations, and the SU(2)/SO(3) relation; chapter 5 connects local Lie algebra calculations to global group structure.
- Peter Woit, Columbia, [Lie Groups and Lie Algebras](https://www.math.columbia.edu/~woit/notes2.pdf), [Representations: generalities](https://www.math.columbia.edu/~woit/LieGroups-2012/repgeneralities.pdf), and [SU(2) representations](https://www.math.columbia.edu/~woit/notes10.pdf) provide complementary compact university treatments of the mathematical vocabulary.
- Eckhard Meinrenken, Toronto, [Lie Groups and Lie Algebras](https://www.math.toronto.edu/mein/teaching/LectureNotes/lie.pdf) supplies a further reference for the exponential and covering-group qualifications.

All exposition and diagrams should be original. These references support facts and conventions; no source prose or figures need be copied.

## Independently derived checks to apply to the draft

### Gauge convention

Set `ψ'=Uψ`, `Dμ=∂μ−igAμ`, with Hermitian `Aμ` and `T_a`. Expanding `D'μ(Uψ)=U Dμψ` gives

```text
(∂μU)−igA'μU = −igUAμ,
A'μ = UAμU⁻¹ − (i/g)(∂μU)U⁻¹
    = UAμU⁻¹ + (i/g)U(∂μU⁻¹).
```

For `U=exp(iqα)` and `D=∂−ieqA`, the Abelian specialization is `A'=A+∂α/e`. If instead the phase is `exp(ieqχ)`, it is `A'=A+∂χ`. Either parametrization is valid; they must not be mixed.

Expansion on an arbitrary test field cancels the terms containing first derivatives of that field:

```text
[Dμ,Dν] = −ig(∂μAν−∂νAμ)−g²[Aμ,Aν] = −igFμν,
Fμν = ∂μAν−∂νAμ−ig[Aμ,Aν].
```

With `[T_a,T_b]=if^{abc}T_c`, the component nonlinear term is positive:

```text
F^a_μν = ∂μA^a_ν−∂νA^a_μ+g f^{abc}A^b_μ A^c_ν.
```

Covariance of `D` implies `F'=UFU⁻¹`. The connection has an inhomogeneous derivative term, so it must not be described as transforming purely in the adjoint under arbitrary local transformations. Curvature and the homogeneous/constant part of the connection do transform in the adjoint.

For constant `A_x=aT_1`, `A_y=bT_2` in SU(2), `F_xy=gabT_3`, although both derivative terms vanish. Parallel transport with `Dψ=0` satisfies `dψ/ds=ig Aμ ẋμψ`. A small counterclockwise rectangle (right, up, left, down) therefore has `U_loop=I+igF_xy δxδy+O(δ³)` with column vectors and later transport factors on the left. The orientation and sign should be stated whenever this formula is used.

### Lie algebra and group checks

- For a unitary curve `U(t)=I+tX+…`, differentiating `U†U=I` gives `X†=−X`; differentiating `det U=1` gives `tr X=0`. Physics generators `T_a` are Hermitian and enter `X=iθ^aT_a`. The real vector space of Hermitian generators is not closed under the raw matrix commutator; its corresponding real bracket is `−i[T,S]`.
- An anti-Hermitian n-by-n matrix has `n` imaginary diagonal parameters and `2·n(n−1)/2` off-diagonal real parameters: `n²`. Tracelessness removes one real parameter, giving `dim_R SU(n)=n²−1`.
- `T_a=σ_a/2` gives `[T_a,T_b]=iε_abc T_c` and `tr(T_a T_b)=δ_ab/2`. If `X_a=iT_a`, then `[X_a,X_b]=−ε_abc X_c`; if `X_a=−iT_a`, the sign is positive. A silent switch between those bases causes a real error.
- `exp(−iθ n·σ/2)=cos(θ/2)I−i sin(θ/2)n·σ`, so the matrix is `−I` at `θ=2π` and `I` at `θ=4π`. With `V=v·σ` and `V'=UVU†`, this minus-exponential convention induces the usual right-handed spatial rotation by `θ`. A plus-exponential gives the opposite rotation with the same conjugation order; it still has the same covering and 4π properties.
- BCH starts `log(e^X e^Y)=X+Y+[X,Y]/2+…`, locally. The small group commutator `e^{εX}e^{εY}e^{−εX}e^{−εY}` starts `I+ε²[X,Y]+O(ε³)` with precisely that written order.
- The exponential is onto for compact connected Lie groups, but need not be onto an arbitrary connected Lie group. It is not generally one-to-one, even in the compact cases.
- A faithful representation has trivial kernel. An irreducible representation has no nonzero proper invariant subspace. Neither property means the same thing as fundamental/defining, and a direct sum is distinct from a tensor product. For SU(2), `2⊗2=3⊕1`; the antisymmetric singlet follows from invariance of the two-dimensional determinant.

### Standard Model checks

Use the order `(SU(3)_c representation, SU(2)_L representation)_Y`. For physical right-chiral fields (not charge-conjugated left-chiral fields):

| Field | Representation | Charges from Q=T3+Y |
| --- | --- | --- |
| Q_L | (3,2)_(1/6) | 2/3, −1/3 |
| u_R | (3,1)_(2/3) | 2/3 |
| d_R | (3,1)_(−1/3) | −1/3 |
| L_L | (1,2)_(−1/2) | 0, −1 |
| e_R | (1,1)_(−1) | −1 |
| H | (1,2)_(1/2) | +1, 0 |

Charge conjugation changes chirality, replaces a color triplet by an antitriplet, and reverses Y. Anomaly sums using only left-chiral fields must make that conversion. Weak isospin is internal, distinct from spacetime spin; SU(2)_L acts on the Higgs as well as left-chiral fermions. Chirality and helicity are not interchangeable for massive particles.

Right-chiral charged fermions being SU(2)_L singlets does not make them noninteracting with every weak-sector field: their hypercharge coupling produces a Z coupling after mixing. Avoid equating “SU(2) singlet” with “no weak interaction.” The Higgs discovery was announced in 2012; a 2013 date in Tong's printed discussion is a typo and should not be repeated.

The three factors supply `8+3+1=12` gauge generators before electroweak breaking. This counts independent gauge-field species, not matter components, spatial dimensions, physical polarizations, or asymptotic free gluons. The left quark multiplet has `3×2=6` internal components.

The common coupling convention is

```text
Dμ = ∂μ − ig_s G^a_μ t^a_R − ig W^i_μ T^i_R − ig' Y Bμ,
Aμ = sinθ_W W³μ + cosθ_W Bμ,
Zμ = cosθ_W W³μ − sinθ_W Bμ,
tanθ_W = g'/g,     e=g sinθ_W=g' cosθ_W.
```

Substitution gives the photon coefficient `−ie(T3+Y)Aμ`. For `⟨H⟩=(0,v/√2)^T`, `(T3+Y)⟨H⟩=0`. At tree level `m_W=gv/2`, `m_Z=v√(g²+g'²)/2`, `m_γ=0`. The U(1)_Y field B is therefore not by itself the photon.

For the optional global-form check use the integer generator `y=6Y`, with U(1) represented as `z^y`. The central element

```text
(exp(2πi/3) I₃, −I₂, exp(iπ/3))
```

acts trivially on every row of the table. E.g. on `Q_L` the phases multiply to `exp(2πi/3)·(−1)·exp(iπ/3)=1`; on `u_R` they give `exp(2πi/3)·exp(4πi/3)=1`; on `H` they give `(−1)·exp(iπ)=1`. This exhibits the Z6 kernel on these local fields, but does not decide the spectrum of allowed line operators or select the global quotient uniquely.

### Arithmetic cross-check

A JavaScript check using only small integer arithmetic verified the six table rows in units `y=6Y`: electric-charge numerators `(4,−2),4,−2,(0,−6),−6,(6,0)` in the displayed order; all six central phases have exponent zero modulo six. As a supplementary consistency check, the SU(3)^2–Y, SU(2)^2–Y, Y^3, and gravitational–Y anomaly sums vanish after converting right-chiral fermions to left-chiral conjugates, and the number of weak doublets per generation is even. These are checks of the table, not an anomaly derivation or formal verification of the article.

## Review gate

### First-pass findings (sections 8.1–8.10)

- **Resolved and verified:** section 8.10 originally wrote `T_a=ρ_*(t_a)`, despite the correct earlier statement that the Hermitian `t_a` are not tangent matrices. The writer replaced it with `dρ(i t_a)=iT_a`, equivalently `T_a=−i dρ(i t_a)`.
- **Resolved and verified:** after showing that `V↦UVU†` preserves vector norm, the writer added continuity of the action on connected SU(2) and its value at the identity to justify determinant `+1`, rather than merely membership in O(3).
- **Resolved:** the representation diagram's article alt text now describes the actual direct-sum/tensor-product graphic and triplet/singlet decomposition.
- Worked examples 1–9 were recalculated: clock inverses, triangle permutations, phase/rotation equivalence, infinitesimal planar rotation, noncommuting 3D rotations, dimension count, SU(n) exponential, commutator/BCH signs, Pauli commutators, spinor conjugation, and doublet decomposition agree with the text.

### Diagram mathematics

The original generator `scripts/generate-groups-diagrams.mjs` was read in full. Triangle slot labels implement `r=(123)`, `s=(23)`, `sr=(13)`, `rs=(12)`; the two planar pictures use the same counterclockwise angle; the two algebra-vector lengths have ratio five and exponentiate to the same circle point. The SU(2) path labels, normalized triplet/singlet states, positive-oriented curvature loop, gauge-generator counts, and electroweak mixing signs are consistent. The diagram author resolved the suggested index-placement refinement by using coordinate superscripts and curvature subscripts. The triangle display now asserts inequality of transformations without incorrectly requiring unequal action on every point. Visual rendering and accessibility validation are separate release checks.

### Second-half review (sections 8.11–8.20)

- The general Hermitian traceless SU(3) matrix has eight independent real parameters. `3⊗3̄=1⊕8` correctly distinguishes the complexified adjoint matter representation from the eight-dimensional real tangent algebra. Color and flavor are kept distinct.
- The global-to-local derivative obstruction is explicitly derived. The gauge transformation law follows by cancellation, and the U(1) phase-gradient example independently checks its sign. The connection is correctly distinguished from an adjoint-covariant tensor.
- Expanding two covariant derivatives gives the stated curvature, including the positive structure-constant component term. Wilson transport, endpoint transformations, loop orientation, and the leading `+igF` area term agree. The local-versus-global flat-connection qualification is correct.
- The Yang–Mills normalization agrees with `tr(t_a t_b)=δ_ab/2`. Constant noncommuting potentials give the stated nonzero curvature. Abelian classical self-interactions and matter-loop corrections are properly distinguished.
- Every Standard Model representation and electric charge was checked using actual right-chiral fields and `Q=T3+Y`. The hypercharge period is reconciled with integer U(1) weights. The text separates weak isospin from spatial spin, chirality from helicity, and generators from particle or polarization counts.
- The Higgs quadratic term yields the correct neutral mass matrix, charged and neutral masses, Weinberg-angle mixing, and photon coupling. The local-redundancy qualification and tree-level scope are explicit. The perturbative degree-of-freedom count agrees before and after the Higgs mechanism.
- Each phase in the displayed Z6 action was checked, and the global quotient is correctly left undetermined by the local particle table. The mixed SU(2)^2–U(1) anomaly example vanishes with the suppressed common index stated; it is not presented as a complete anomaly proof.
- Worked examples 10–17 and answers to exercises 1–12 were independently recalculated. No mathematical error found.
- **Resolved and verified:** the boundary wording now says gauge transformations approach the identity; it no longer says group-valued transformations vanish. The U(1) representation classification now explicitly assumes continuity.
- **Resolved in translation review:** section 8.4 now calls `v^T v` the squared Euclidean length and `z†z` the nonnegative squared norm. The earlier source wording omitted “squared” and called the latter positive, although the zero vector is allowed. Equations and derivation were unchanged. The cross-language review caught this precision issue after the initial English pass; the coordinating agent updated the English and requested alignment across translations.

The English article is cleared for translation. This review does not claim formal verification. Production build, translation fidelity, accessibility, deployment, and route checks belong to the coordinating agent's separate release review.
