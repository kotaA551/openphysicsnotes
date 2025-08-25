import Link from 'next/link';
import { getAllChapters } from '@/lib/mdx';
import LevelBadge from '@/components/LevelBadge';


export default function HomePage() {
const chapters = getAllChapters();
return (
<article className="prose prose-zinc max-w-none">
<h1>Quantum Gravity Notes</h1>
<p>
A gentle, honest walk from classical physics to quantum fields and gravity. Built for curious beginners,
with equations you can actually read.
</p>
<ol className="not-prose divide-y divide-zinc-200 rounded-xl border bg-white">
{chapters.map((c) => (
<li key={c.slug} className="p-4 hover:bg-zinc-50">
<Link href={`/chapters/${c.slug}`} className="block">
<div className="flex items-center gap-3">
<LevelBadge level={c.level} />
<h3 className="m-0 text-base font-semibold">{c.title}</h3>
</div>
{c.description && <p className="m-0 mt-1 text-sm text-zinc-600">{c.description}</p>}
</Link>
</li>
))}
</ol>
</article>
);
}