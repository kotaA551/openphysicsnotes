export const dynamic = 'force-static';
export const runtime = 'nodejs';


import Link from 'next/link';
import { getAllChapters, getAllTags } from '@/lib/mdx';


export const dynamicParams = false;


export async function generateStaticParams() {
return getAllTags().map((t) => ({ tag: t.tag }));
}


export default function TagPage({ params }: { params: { tag: string } }) {
const { tag } = params;
const chapters = getAllChapters().filter((c) => c.tags.includes(tag));
return (
<section className="prose prose-zinc max-w-none">
<h1>#{tag}</h1>
<ul className="not-prose divide-y divide-zinc-200 rounded-xl border bg-white">
{chapters.map((c) => (
<li key={c.slug} className="p-4 hover:bg-zinc-50">
<Link href={`/chapters/${c.slug}`} className="block">
<h3 className="m-0 text-base font-semibold">{c.title}</h3>
{c.description && <p className="m-0 mt-1 text-sm text-zinc-600">{c.description}</p>}
</Link>
</li>
))}
</ul>
</section>
);
}