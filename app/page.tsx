import Link from 'next/link';
import { getAllChapters } from '@/lib/mdx';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function HomePage() {
  const chapters = getAllChapters();

  return (
    <main className="prose prose-zinc max-w-none">
      <h1>Open Physics Notes</h1>
      <p>Open, beginner-friendly notes toward quantum gravity.</p>
      <img src="" alt="top image" />
      <p>
        We’ll start with classical mechanics and slowly build up to the strange world of quantum fields.
        Along the way, expect short explanations, simple diagrams, and pointers for deeper study.
        The goal is not just to memorize formulas, but to really understand the ideas that power modern physics.
        This project is still growing—new chapters and revisions will appear regularly.
        Whether you’re a curious beginner or a student looking for extra clarity, welcome aboard.
      </p>
    </main>
  );
}
