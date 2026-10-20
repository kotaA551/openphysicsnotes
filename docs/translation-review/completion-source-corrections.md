# Source corrections and remaining editorial questions

This record accompanies completion of the French, Italian, Spanish, Traditional Chinese and Korean article editions. Translation review checks fidelity to the English source; it does not establish every historical attribution or independently derive every scientific statement.

## Harmonic-oscillator sign and indices

Chapter 7, section 7.3.3 defines

\[
a=\frac{x/x_0+i p/p_0}{\sqrt2},\qquad
a^\dagger=\frac{x/x_0-i p/p_0}{\sqrt2}.
\]

Subtracting these definitions gives

\[
p=\frac{p_0}{i\sqrt2}(a-a^\dagger)
 =\frac{i p_0}{\sqrt2}(a^\dagger-a).
\]

The former expression in section 7.3.5 had the opposite sign. The two displayed matrix-element formulas also used an unspecified primed index on the right but different indices on the left. The consistent formulas are

\[
\langle n'|x|n\rangle=\frac{x_0}{\sqrt2}
\left(\sqrt{n+1}\,\delta_{n',n+1}+\sqrt n\,\delta_{n',n-1}\right),
\]

\[
\langle n'|p|n\rangle=\frac{i p_0}{\sqrt2}
\left(\sqrt{n+1}\,\delta_{n',n+1}-\sqrt n\,\delta_{n',n-1}\right).
\]

Two independent checks support this correction. Acting with the article's coordinate operator \(p=-i\hbar\partial_x\) on its ground-state Gaussian gives \(\langle1|p|0\rangle=+i p_0/\sqrt2\). A numerical eight-state oscillator calculation gives \([x,p]=+i\hbar\) on the lower seven states with the corrected sign, and \(-i\hbar\) with the old sign. The top truncated state is excluded because a finite matrix cannot satisfy the canonical commutator on its whole space.

These three mathematical spans are synchronized across English and all nine translations. Their exact before/after values are in `tests/translations/source-math-corrections.json`. Source and rendered-build comparisons permit only this explicit correction set and documented translations of descriptive math labels. Other mathematical expressions are preserved.

Two short prose statements in chapter 7 are also clarified. Section 7.1.9 now says that the eigenfunctions corresponding to distinct eigenvalues are orthogonal, matching the displayed inner product. Section 7.6.4 now says that the nondegenerate perturbation formulas have zero denominators at degeneracy; the denominators themselves do not diverge. The French, Italian, Spanish and Korean wording was corrected where necessary; the other translations already expressed the intended meaning accurately and were retained. These changes do not alter any equation, heading, anchor or discussion identifier.

## Translation omissions restored

The existing Simplified Chinese edition had two fully English image alternatives and several shortened image descriptions. The review restored their full source meaning, as well as a few omitted qualifiers in other existing editions. It also restored the strongly continuous qualifier for the unitary group, distinguished an initial thermodynamic state from a temperature, and clarified that \(K\) denotes an equilibrium constant. The Chinese editions now explicitly retain the \(2k_F\) distortion wavevector, generic three-dimensional extrema/saddle qualifier, schematic conductivity tensor, and compensation-regime/asymptotic qualifications in chapter 10. The general hysteresis of a Mott transition is distinguished from magnetic hysteresis, and one Traditional Chinese rendering of Poisson's name is corrected.

Descriptive text inside math expressions is localized through the explicit `math-annotations.json` map. Variable names, units, conventional symbolic subscripts and mathematical operators remain unchanged. `reviewed-corrections.json` records every additional permitted edit to the previously published article sources.

## Questions retained for a separate source edit

- The Haber–Bosch example says high pressure and moderate temperature maximize \(K\). At fixed temperature, pressure changes equilibrium composition, whereas temperature changes the equilibrium constant. This wording remains the source's statement; translations do not silently substitute a different claim. [OpenStax Chemistry 2e, section 13.3](https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle).
- The Michelson–Morley passage describes using fringes to detect Earth's motion without clearly stating the null result locally. The historical result is documented by [Case Western Reserve University](https://case.edu/ech/articles/m/michelson-morley-experiment).
- The X-ray passage's “atomic waves” and some Fourier-diffraction wording could identify scattered waves, far-field conditions and amplitude versus intensity more precisely. The [International Union of Crystallography's introduction](https://www.iucr.org/what-we-do/education/pamphlets/introduction-scope-potential-and-applications-of-x-ray-analysis) supports the scattering interpretation. These are editorial qualifications, not new translation omissions.
- The kinetic-equation force notation may require a factor of inverse mass if its symbol denotes force rather than acceleration. The ATP example does not clearly distinguish standard free energy from cellular conditions. The Venus greenhouse wording, bridge-resonance generalization, historical anecdotes and attributed quotations also merit a separate source review. No unsupported historical correction is introduced here.

The Micius example was checked and does not require correction: the 2017 satellite-to-ground decoy-state QKD paper reports a maximum link distance of 1,200 km. This should not be confused with a later entanglement-based key-distribution experiment. [Liao et al., Satellite-to-Ground Quantum Key Distribution](https://arxiv.org/abs/1707.00542).
