import Link from 'next/link';
import { getAllTags } from '@/lib/mdx';


export default function TagsPage() {
const tags = getAllTags();
return (
<section className="prose prose-zinc max-w-none">
<h1>Tags</h1>
<ul className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-2">
{tags.map((t) => (
<li key={t.tag}>
<Link href={`/tags/${encodeURIComponent(t.tag)}`} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-1 hover:bg-zinc-50">
<span>#{t.tag}</span>
<span className="text-xs text-zinc-500">{t.count}</span>
</Link>
</li>
))}
</ul>
</section>
);
}