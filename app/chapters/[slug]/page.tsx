import { getAllChapters, getChapter } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Callout from '@/components/Callout';
import type { Metadata } from 'next';

export const dynamicParams = false;
export const dynamic = 'force-static';
export const runtime = 'nodejs';

// return a plain array (no async keyword needed)
export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: any): Metadata {
  const c = getChapter(params.slug);
  return {
    title: `${c.title} — Open Physics Notes`,
  };
}

const components = { Callout } as const;

export default function ChapterPage({ params }: any) {
  const chapter = getChapter(params.slug);
  return (
    <article className="prose prose-zinc max-w-none">
      <h1 className="flex items-center gap-3">
        <span>{chapter.title}</span>
      </h1>
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
