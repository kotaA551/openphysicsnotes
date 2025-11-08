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
import Link from 'next/link';
import { chapters } from '@/lib/chapters';
import { curiosities } from '@/lib/curiosities';

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
      <MDXRemote
        source={curiosity.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], ],
            format: 'mdx',
          },
        }}
        components={components}
      />
      <section className="mt-10 flex flex-col lg:flex-row lg:justify-between gap-10">
        {/* Chapters */}
        <div className="lg:w-1/2">
          <h2 className="font-semibold text-xl mb-3">Chapters</h2>
          <ul className="space-y-2">
            {chapters.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/chapters/${c.slug}`}
                  className="hover:underline"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Curiosities */}
        <div className="lg:w-1/2">
          <h2 className="font-semibold text-xl mb-3">Curiosities</h2>
          <ul className="space-y-2">
            {curiosities.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/curiosities/${item.slug}`}
                  className="hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>


    
  );
}
