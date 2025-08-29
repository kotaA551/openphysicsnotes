// /app/curiosities/[slug]/page.tsx
import { getAllCuriosities, getCuriosity } from '@/lib/mdx';
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

// build-time params for static generation
export function generateStaticParams() {
  return getAllCuriosities().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: any): Metadata {
  const c = getCuriosity(params.slug);
  return {
    title: `${c.title} — Open Physics Notes`,
    description: c.summary,
  };
}

const components = { Callout } as const;

export default function CuriosityPage({ params }: any) {
  const curiosity = getCuriosity(params.slug);

  return (
    <article className="prose prose-zinc max-w-none">
      <h1 className="flex items-center gap-3">
        <span>{curiosity.title}</span>
      </h1>
      {curiosity.summary && <p className="lead">{curiosity.summary}</p>}
      <MDXRemote
        source={curiosity.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              rehypeKatex,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
            format: 'mdx',
          },
        }}
        components={components}
      />
    </article>
  );
}
