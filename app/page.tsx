import Link from 'next/link';
import { getAllChapters } from '@/lib/mdx';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function HomePage() {
  const chapters = getAllChapters();

  const imagePaths = [
    '/images/Isaac-Neweton.png',
    '/images/James-Maxwell.png',
    '/images/Charles-Augustin-de-Coulomb.png',
    '/images/Carl-Friedrich-Gauss.png',
  ];

  return (
    <main className="prose prose-zinc max-w-none">
      <h1>Open Physics Notes</h1>

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
      <p>
        We’ll start with classical mechanics and slowly build up to the strange world of quantum fields.
        Along the way, expect short explanations, simple diagrams, and pointers for deeper study.
        The goal is not just to memorize formulas, but to really understand the ideas that power modern physics.
        This project is free to use for textbook or others. 
        Translate by using brower's translate function.
        Whether you’re a curious beginner or a student looking for extra clarity, welcome aboard.
      </p>
    </main>
  );
}
