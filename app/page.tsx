import Link from 'next/link';
import { getAllChapters } from '@/lib/mdx';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function HomePage() {
  const chapters = getAllChapters();

  return (
    <main className="prose prose-zinc max-w-none">
      <h1>Quantum Gravity Notes</h1>
      <p>Open, beginner-friendly notes toward quantum gravity.</p>
      <ul>
        {chapters.map((c) => (
          <li key={c.slug}>
            <Link href={`/chapters/${c.slug}`}>
              {c.title} — {c.description}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
