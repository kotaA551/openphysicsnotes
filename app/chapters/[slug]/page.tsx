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

export const dynamicParams = false;        // pre-render all chapters
export const dynamic = 'force-static';
export const runtime = 'nodejs';

// return a plain array (no async keyword needed)
export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

// be chill about the param typing to satisfy Next’s generic PageProps
export function generateMetadata({ params }: any): Metadata {
  const c = getChapter(params.slug);
  return {
    title: `${c.title} — Quantum Gravity Notes`,
    description: c.description,
  };
}

const components = { Callout } as const;

export default function ChapterPage({ params }: any) {
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
