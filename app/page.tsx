import Link from 'next/link';
import { getAllChapters } from '@/lib/mdx';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function HomePage() {
  const chapters = getAllChapters();

  const imagePaths = [
    '/images/Isaac-Neweton.png',
    '/images/James-Clerk-Maxwell.png',
    '/images/Charles-Augustin-de-Coulomb.png',
    '/images/Carl-Friedrich-Gauss.png',
    '/images/Michael-Faraday.png',
    '/images/André-Marie-Ampère.png',
    '/images/Félix-Savart.png',
    '/images/Jean-Baptiste-Biot.png',
    '/images/Albert-Einstein.png',

  ];

  return (
    <main className="prose prose-zinc max-w-none">
      <h1>Open Physics Notes</h1>
      
      {/* Image grid */}
      <div
        className="
          not-prose
          grid gap-3
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          2xl:grid-cols-6
          my-6
        "
        aria-label="image table"
      >
        {imagePaths.map((src, i) => (
          <figure
            key={i}
            className="aspect-square overflow-hidden rounded-xl shadow-sm border border-zinc-200"
          >
            <img
              src={src}
              alt={`gallery item ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>

      {/* Table of Contents */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
        <nav
          aria-label="Table of contents"
          className="mt-8 rounded-2xl border border-gray-200 p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold">Contents</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li><a className="hover:underline" href="#principles">0. Study Principles</a></li>
            <li><a className="hover:underline" href="#prereqs">1. Prerequisites</a></li>
            <li><a className="hover:underline" href="#foundations">2. Foundations (Year 1)</a></li>
            <li><a className="hover:underline" href="#math">3. Math Toolkit</a></li>
            <li><a className="hover:underline" href="#intermediate">4. Intermediate (Year 2)</a></li>
            <li><a className="hover:underline" href="#advanced-ug">5. Advanced UG Core</a></li>
            <li><a className="hover:underline" href="#grad-core">6. Graduate Core</a></li>
            <li><a className="hover:underline" href="#modern-fields">7. Modern Fields</a></li>
            <li><a className="hover:underline" href="#research-stack">8. Research Stack</a></li>
            <li><a className="hover:underline" href="#projects">9. Capstone Projects</a></li>
            <li><a className="hover:underline" href="#how-to-use-opn">10. How to Use OPN</a></li>
            <li><a className="hover:underline" href="#books">11. Recommended References</a></li>
            <li><a className="hover:underline" href="#schedule">12. Suggested Weekly Rhythm</a></li>
            <li><a className="hover:underline" href="#ethos">13. Openness & Ethos</a></li>
          </ul>
        </nav>
      </section>

      {/* 0. Study Principles */}
      <section id="principles" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">0. Study Principles</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Concept → Problem → Feedback.</strong> Read, then solve. Iterate fast.</li>
          <li><strong>Layering beats cramming.</strong> Revisit topics with increasing rigor.</li>
          <li><strong>Computation is part of physics.</strong> Simulate what you can’t measure.</li>
          <li><strong>Primary sources matter.</strong> Textbooks teach; papers reveal the frontier.</li>
          <li><strong>Write to learn.</strong> Maintain a lab-style notebook (LaTeX + Git).</li>
        </ul>
      </section>

      {/* 1. Prerequisites */}
      <section id="prereqs" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">1. Prerequisites</h2>
        <p className="mt-3">
          Comfortable high-school math/physics: algebra, trigonometry, basic calculus ideas, vectors,
          and a first pass at kinematics & Newton’s laws. If you’re rusty, spend 2–4 weeks refreshing.
        </p>
      </section>

      {/* 2. Foundations */}
      <section id="foundations" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">2. Foundations (Year 1)</h2>
        <div className="mt-4 space-y-3">
          <p><strong>Mechanics I:</strong> vectors, kinematics, Newton’s laws, energy, momentum, rotations.</p>
          <p><strong>E&M I:</strong> electrostatics, circuits, magnetic fields, Maxwell preview.</p>
          <p><strong>Intro to Waves & Optics:</strong> oscillations, interference, diffraction.</p>
          <p><strong>Problem sets:</strong> 30–50 problems per chapter tiered by difficulty.</p>
        </div>
      </section>

      {/* 3. Math Toolkit */}
      <section id="math" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">3. Math Toolkit</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Calculus (single & multi), series, vector calculus (div, grad, curl, Stokes & Gauss).</li>
          <li>Linear algebra (eigenstuff, diagonalization, spectral theorems).</li>
          <li>Differential equations (ODE/PDE, Green’s functions, Sturm–Liouville).</li>
          <li>Complex analysis (contours, residues, analytic continuation, special functions).</li>
          <li>Probability & statistics (Bayes, MLE, CLT, Markov chains).</li>
        </ul>
      </section>

      {/* 4. Intermediate */}
      <section id="intermediate" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">4. Intermediate (Year 2)</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Thermodynamics & Statistical Mechanics:</strong> micro/macro states, ensembles, partition function.</li>
          <li><strong>Classical Mechanics II:</strong> Lagrangian & Hamiltonian formalisms, canonical transformations.</li>
          <li><strong>E&M II:</strong> Maxwell’s equations in matter, waveguides, radiation.</li>
          <li><strong>Intro Quantum Mechanics:</strong> postulates, 1D problems, angular momentum, perturbation theory.</li>
        </ul>
      </section>

      {/* 5. Advanced UG Core */}
      <section id="advanced-ug" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">5. Advanced Undergraduate Core</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Quantum I–II:</strong> Hilbert spaces, scattering, identical particles, spin, variational methods.</li>
          <li><strong>Electrodynamics:</strong> boundary value problems, radiation, relativistic electrodynamics.</li>
          <li><strong>Relativity (SR intro):</strong> Minkowski spacetime, tensors, electromagnetism in covariant form.</li>
        </ul>
      </section>

      {/* 6. Graduate Core */}
      <section id="grad-core" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">6. Graduate Core</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Quantum Field Theory I:</strong> path integrals, canonical quantization, symmetries, perturbation theory.</li>
          <li><strong>General Relativity:</strong> differential geometry, Einstein equations, black holes, cosmology basics.</li>
          <li><strong>Statistical Physics (grad):</strong> renormalization ideas, critical phenomena, nonequilibrium basics.</li>
        </ul>
      </section>

      {/* 7. Modern Fields */}
      <section id="modern-fields" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">7. Modern Fields (Choose tracks)</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">High-Energy / Theory</h3>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>QFT II, Gauge theory, Standard Model, QCD, EFT, CFT, SUSY (as taste).</li>
              <li>Cosmology, early Universe, inflation, LSS, CMB.</li>
              <li>Amplitudes, scattering, bootstrap (advanced).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Condensed Matter</h3>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Many-body theory, second quantization, Fermi liquids, BCS.</li>
              <li>Topological phases, quantum Hall, Chern insulators.</li>
              <li>Numerics: DMRG, QMC (intro level), exact diagonalization.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">AMO / Quantum Tech</h3>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Cold atoms, trapped ions, cavity QED, quantum control.</li>
              <li>Quantum information, error correction, NISQ algorithms.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Plasma / Astro</h3>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Plasma kinetics & MHD, fusion basics.</li>
              <li>Astrophysics & GR applications, neutron stars, accretion.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Research Stack */}
      <section id="research-stack" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">8. Research Stack (Tools & Workflow)</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Computation:</strong> Python (NumPy, SciPy, Matplotlib, JAX), SymPy, Julia (optional), Mathematica/Maple.</li>
          <li><strong>Reproducibility:</strong> Git/GitHub, unit tests, notebooks → reports (nbconvert or LaTeX).</li>
          <li><strong>Writing:</strong> LaTeX (Overleaf), BibTeX/Zotero, citation hygiene.</li>
          <li><strong>Paper flow:</strong> arXiv alerts (RSS), weekly digests, implement & replicate key results.</li>
        </ul>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <strong>Pro tip:</strong> keep a “Replication Logbook” repo:
          problem statement → assumptions → derivations → code → plots → takeaways.
        </div>
      </section>

      {/* 9. Capstone */}
      <section id="projects" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">9. Capstone Projects (Examples)</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Derive & simulate solitons for a nonlinear PDE; compare numerics vs analytics.</li>
          <li>QFT: 1-loop correction in a simple scalar theory; visualize running couplings.</li>
          <li>GR: geodesics around Schwarzschild/Kerr; lensing visualizations.</li>
          <li>CondMat: tight-binding bands + Berry curvature; topological invariants.</li>
          <li>AMO: simulate two-level control & Rabi oscillations; noise sensitivity.</li>
        </ul>
      </section>

      {/* 10. How to use OPN */}
      <section id="how-to-use-opn" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">10. How to Use Open Physics Notes</h2>
        <ol className="mt-4 list-decimal pl-6 space-y-2">
          <li>Pick your level (Foundations → Grad Core → Track).</li>
          <li>Read OPN sections, then crush the problem sets.</li>
          <li>Use the “Further Reading” box to jump into textbooks/papers.</li>
          <li>Build mini-projects every 2–3 weeks to cement skills.</li>
          <li>Publish your notes & code. The world needs your replication results.</li>
        </ol>
      </section>

      {/* 11. Recommended References (with affiliate slots) */}
      <section id="books" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">11. Recommended References</h2>
        <p className="mt-3 text-gray-700">
          These are classic, time-tested texts. Links marked “(aff)” are affiliate links that help keep OPN free.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-semibold">Foundations / Broad</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                The Feynman Lectures on Physics — Vol I–III{" "}
                <Link href="https://example.com/feynman-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Young & Freedman, University Physics{" "}
                <Link href="https://example.com/univ-physics-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Classical Mechanics</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Goldstein, Classical Mechanics{" "}
                <Link href="https://example.com/goldstein-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Taylor, Classical Mechanics{" "}
                <Link href="https://example.com/taylor-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Electrodynamics</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Griffiths, Introduction to Electrodynamics{" "}
                <Link href="https://example.com/griffiths-em-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Jackson, Classical Electrodynamics{" "}
                <Link href="https://example.com/jackson-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Quantum Mechanics / QFT</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Griffiths & Schroeter, Intro to Quantum Mechanics{" "}
                <Link href="https://example.com/griffiths-qm-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Sakurai & Napolitano, Modern Quantum Mechanics{" "}
                <Link href="https://example.com/sakurai-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Peskin & Schroeder, An Introduction to QFT{" "}
                <Link href="https://example.com/peskin-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Statistical Physics</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Reif / Kittel / Pathria (choose one track){" "}
                <Link href="https://example.com/statphys-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Relativity / GR</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Schutz, A First Course in General Relativity{" "}
                <Link href="https://example.com/schutz-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
              <li>
                Carroll, Spacetime and Geometry{" "}
                <Link href="https://example.com/carroll-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Mathematical Methods</h3>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Boas / Arfken / Riley-Hobson-Bence{" "}
                <Link href="https://example.com/mathmethods-aff" className="text-blue-600 underline">(aff)</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Replace the example links with your Amazon Associates or other affiliate URLs.
        </p>
      </section>

      {/* 12. Weekly Rhythm */}
      <section id="schedule" className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold">12. Suggested Weekly Rhythm</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>Mon–Tue:</strong> New theory (reading + derivations)</li>
          <li><strong>Wed:</strong> Problem-solving marathon</li>
          <li><strong>Thu:</strong> Mini-project or simulation</li>
          <li><strong>Fri:</strong> Paper digest (1–2 arXiv abstracts + 1 deep read)</li>
          <li><strong>Sat:</strong> Write-up & refactor notes/code</li>
          <li><strong>Sun:</strong> Rest or light review (spaced repetition)</li>
        </ul>
      </section>

      {/* 13. Ethos */}
      <section id="ethos" className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold">13. Openness & Ethos</h2>
        <p className="mt-3">
          Education should be borderless. OPN is free to read for everyone. If you find it useful,
          consider supporting via affiliate links or donations so others can learn without barriers.
        </p>
      </section>
    </main>
  );
}
