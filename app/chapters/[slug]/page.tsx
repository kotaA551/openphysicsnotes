import { getAllChapters, getChapter } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Callout from '@/components/Callout';
import LevelBadge from '@/components/LevelBadge';
import type { Metadata } from 'next';


export const dynamicParams = false; // pre-render all chapters


export async function generateStaticParams() {
return getAllChapters().map((c) => ({ slug: c.slug }));
}


export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
const c = getChapter(params.slug);
return { title: `${c.title} — Quantum Gravity Notes`, description: c.description };
}


const components = { Callout } as const;


export default function ChapterPage({ params }: { params: { slug: string } }) {
const chapter = getChapter(params.slug);
return (
<article className="prose prose-zinc max-w-none">
<h1 className="flex items-center gap-3">
<LevelBadge level={chapter.level} />
<span>{chapter.title}</span>
</h1>
{chapter.description && <p className="lead">{chapter.description}</p>}
<MDXRemote
source={chapter.content}
options={{
mdxOptions: {
remarkPlugins: [remarkGfm, remarkMath],
rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
format: 'mdx',
},
}}
components={components}
/>
</article>
);
}