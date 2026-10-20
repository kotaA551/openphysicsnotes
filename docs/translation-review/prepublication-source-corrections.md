# Source corrections found during the derivation audit

These corrections preserve each chapter's existing definitions and conventions. They are synchronized across all ten article editions. The related problem solutions and derivations explain the steps to readers; this record documents the source changes for maintenance.

## Fixed-target invariant in chapter 5

Chapter 5 defines a four-momentum as \(p^\mu=(E/c,\mathbf p)\), uses the \((+---)\) metric, and defines \(s=(p_a+p_b)^2\). Thus \(s\) has momentum-squared units. For a target at rest, \(p_b=(m_b c,\mathbf0)\), and

\[
s=m_a^2c^2+m_b^2c^2+2(E_a/c)(m_bc)
 =m_a^2c^2+m_b^2c^2+2m_bE_a.
\]

The extra division by \(c\) in the final cross term is removed. Multiplication by \(c^2\) gives the following equation already printed in the chapter, and the existing threshold-energy result is retained. The beam energy here includes its rest energy. Compare [PDG, Kinematics](https://pdg.lbl.gov/2025/reviews/rpp2025-rev-kinematics.pdf), which writes the equivalent relation in natural units.

## Photon-mediated lepton production in chapter 8

For tree-level photon exchange in \(e^-e^+\to\mu^-\mu^+\), neglect both masses and average over all four incoming spin combinations while summing the outgoing spins. The spin traces give

\[
\overline{|\mathcal M|^2}=\frac{2e^4(t^2+u^2)}{s^2}.
\]

In the center-of-momentum frame, \(t=-s(1-\cos\theta)/2\) and \(u=-s(1+\cos\theta)/2\), so

\[
\overline{|\mathcal M|^2}=e^4(1+\cos^2\theta).
\]

The leading factor of two in the old angular expression is removed. With \(\alpha=e^2/(4\pi)\), division by \(64\pi^2s\) yields the existing differential cross section \(\alpha^2(1+\cos^2\theta)/(4s)\). Its angular integral remains \(4\pi\alpha^2/(3s)\). No identical-particle factor applies to the distinct final particles. The massless approximation requires energies well above the muon threshold; this photon-only result excludes weak exchange and radiative corrections. See [PDG, Cross-Section Formulae, §51.2](https://pdg.lbl.gov/2025/reviews/rpp2025-rev-cross-section-formulae.pdf).

## Forced oscillator in chapter 7

Keep \(x_0=\sqrt{\hbar/(m\omega)}\), \(x=x_0(a+a^\dagger)/\sqrt2\), and \(H'(t)=-F(t)x\). Since \([a,a^\dagger]=1\),

\[
[H',a]=\frac{F(t)x_0}{\sqrt2},\qquad
\dot a=\frac{i}{\hbar}[H,a]
 =-i\omega a+\frac{iF(t)x_0}{\sqrt2\hbar}.
\]

The old driving term divided by \(x_0\); it must multiply by \(x_0\). The corrected coefficient has inverse-time units and produces the static displacement \(F/(m\omega^2)\). These identities use the chapter's existing oscillator normalization, also described in [Bertlmann, Harmonic Oscillator and Coherent States](https://homepage.univie.ac.at/reinhold.bertlmann/pdfs/T2_Skript_Ch_5.pdf).

## Doppler spectral index in chapter 5

The chapter uses \(I_\nu=\mathcal D^3 I'_{\nu'}\), \(\nu=\mathcal D\nu'\), and the explicitly positive-exponent convention \(I'_{\nu'}=C\nu'^\alpha\). Direct substitution gives

\[
I_\nu=\mathcal D^3C(\nu/\mathcal D)^\alpha
 =C\mathcal D^{3-\alpha}\nu^\alpha.
\]

The exponent therefore changes from \(3+\alpha\) to \(3-\alpha\). The frequently quoted plus sign uses the different convention \(I'_{\nu'}\propto\nu'^{-\alpha}\); that convention is not silently substituted here. See [Urry and Padovani, Appendix B: Doppler Enhancement](https://ned.ipac.caltech.edu/level5/Urry1/UrryP_appenb.html).

Independent checks included explicit Dirac-matrix traces at six angles, the total solid-angle integral, three fixed-target examples with \(c\ne1\), three forced-oscillator commutator checks, and three Doppler substitutions. This is targeted verification, not a claim of formal verification of the complete textbook.

## Cosmological constant with the chapter 5 curvature convention

The chapter uses signature \((+---)\), \([\nabla_\alpha,\nabla_\beta]V^\mu=R^\mu{}_{\nu\alpha\beta}V^\nu\), \(R_{\nu\beta}=R^\mu{}_{\nu\mu\beta}\), and \(G_{\mu\nu}=(8\pi G/c^4)T_{\mu\nu}\). With \(x^0=ct\) and the flat FLRW metric \(g_{ij}=-a^2\delta_{ij}\), direct substitution gives

\[
\Gamma^0{}_{ij}=a\dot a\delta_{ij}/c,\qquad
\Gamma^i{}_{0j}=H\delta^i_j/c,\qquad
R_{00}=-3\ddot a/(ac^2),\qquad
R=-6(\ddot a/a+H^2)/c^2,
\]

and therefore \(G_{00}=3H^2/c^2\). A positive vacuum density satisfies \(T_{\mu\nu}^{\rm vac}=\rho_\Lambda c^2g_{\mu\nu}\), where \(\rho_\Lambda=\Lambda c^2/(8\pi G)\). Its contribution is \(+\Lambda g_{\mu\nu}\) on the right, or \(-\Lambda g_{\mu\nu}\) on the left when the right side contains matter alone. The old parenthetical plus sign on the left conflicted with the chapter's own later positive-\(\Lambda\) Friedmann term. The sign is corrected while retaining the stated curvature convention. Two independent calculations reproduced the Christoffel symbols, Ricci contraction and Friedmann constraint.

## Kinetic transport and reaction examples in chapter 3

The velocity-space streaming coefficient in the Boltzmann equation is acceleration: the trajectory chain rule gives \(df/dt=\partial_t f+\mathbf v\cdot\nabla_{\mathbf r}f+\mathbf a\cdot\nabla_{\mathbf v}f\). The old symbol \(\mathbf F\) was undefined locally. We now explicitly define it as force on a constant-mass particle and write \(\mathbf F/m\). This resolves an ambiguous convention rather than declaring that an acceleration convention would be mathematically invalid.

For ammonia synthesis, \(Q_p=[y_{\rm NH_3}^2/(y_{\rm N_2}y_{\rm H_2}^3)](P/P^\circ)^{-2}\). Increasing pressure at fixed composition lowers this quotient and changes the equilibrium composition. It does not increase the thermodynamic \(K=\exp[-\Delta_rG^\circ/(RT)]\) at fixed temperature and gas standard state. The Haber–Bosch example now distinguishes equilibrium yield from the equilibrium constant and the temperature compromise needed for practical reaction rates.

The ATP example no longer presents about 30 kJ/mol as a universal cellular free-energy value. Hydrolysis to ADP and inorganic phosphate has \(\Delta_rG'=\Delta_rG^{\circ\prime}+RT\ln(a_{\rm ADP}a_{\rm Pi}/a_{\rm ATP})\) when the solvent activity is approximated by one and biochemical conditions are specified. Its value depends on activities and conditions. The conservative replacement preserves the coupled-reaction statement without asserting an unverified numerical standard value or cellular range. The condition and binding dependence is discussed in [Gajewski, Steckler and Goldberg's thermodynamic study](https://pubmed.ncbi.nlm.nih.gov/3528161/); its accessible abstract reports enthalpy measurements, not a universal cellular Gibbs value.
