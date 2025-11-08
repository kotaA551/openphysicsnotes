import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function HomePage() {

  return (
    <main className="prose prose-zinc max-w-none">
      <h1>Open Physics Notes</h1>
    

      <p>
        Physics is humanity’s attempt to listen to the quiet symphony of the cosmos.<br></br>
        It asks not only <i>what</i> happens, but <i>why</i> and <i>how</i> — and seeks those answers through mathematics, the pure language of nature.<br></br><br></br>

        From the musings of ancient philosophers to the precision of modern science, physics has evolved into the art of uncovering the universe’s logic.<br></br>
        Galileo showed that motion obeys mathematical laws; Newton unified heaven and Earth with his laws of motion and gravity.<br></br>
        The universe became a clockwork cosmos, predictable and elegant.<br></br><br></br>

        Then came light, electricity, and fields.<br></br>
        Faraday’s invisible lines of force and Maxwell’s equations revealed that light itself is an electromagnetic wave — a ripple in a field that binds the universe.<br></br>
        Einstein shattered old notions of space and time, showing that gravity is not a force but the curvature of spacetime.<br></br><br></br>

        Soon, quantum theory exposed a stranger truth: energy is discrete, particles behave like waves, and observation alters reality itself.<br></br>
        From Planck to Schrödinger to Feynman, physicists discovered that everything is built not from matter, but from vibrating fields of probability.<br></br><br></br>

        Today, the Standard Model explains nearly all known particles, yet mysteries remain — dark matter, dark energy, and the unification of gravity and quantum mechanics.<br></br><br></br>

        To study physics is to walk in the footsteps of giants and continue their conversation with the cosmos.<br></br>
        It is not merely to calculate — but to wonder.<br></br>
        To believe that understanding is a form of awe.<br></br>
        And to join the most ambitious dialogue humanity has ever begun.<br></br>
      </p>

      <section>
        <h2>Chapters</h2>
        <ul>
          {chapters.map((c) => (
            <li key={c.slug}>
              <Link href={`/chapters/${c.slug}`}>
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
