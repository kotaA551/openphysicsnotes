import './discussions/discussions.css';
import './article-reading.css';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Callout from './Callout';
import RelatedBooks from './RelatedBooks';
import AffiliateNote from './AffiliateNote';
import TopicIndex from './TopicIndex';
import CycloidalPendulumFigure from './CycloidalPendulumFigure';
import SectionDiscussion from './discussions/SectionDiscussion';
import { DiscussionProvider } from './discussions/DiscussionProvider';
import rehypeDiscussions from '@/lib/discussions/sections.mjs';
import rehypeArticleLayout from '@/lib/article-layout.mjs';
import rehypeArticleAnchors, { articleHeadingIds } from '@/lib/article-anchors.mjs';
import { loadArticle, type ArticleKind } from '@/lib/articles';
import { localePath, messages, type Locale } from '@/lib/i18n';
import { articleMetadata as buildArticleMetadata, articleStructuredData } from '@/lib/seo';
export function articleMetadata(kind: ArticleKind, slug: string, locale: Locale) {
 const result = buildArticleMetadata(kind, slug, locale); if (!result) notFound();
 return result;
}
export default function ArticlePage({ kind, slug, locale }: { kind: ArticleKind; slug: string; locale: Locale }) {
 const article = loadArticle(kind, slug, locale); if (!article) notFound();
 const t = messages(locale);
 const bodyClass = kind === 'chapters' ? 'article-reading' : slug === 'differential-geometry' ? 'article-reading differential-geometry-body' : undefined;
 const schema = articleStructuredData(kind, slug, article);
 const components = { CycloidalPendulumFigure, SectionDiscussion, Callout, RelatedBooks: (props: React.ComponentProps<typeof RelatedBooks>) => <RelatedBooks {...props} heading={t.reading}/>, AffiliateNote: () => <AffiliateNote text={t.affiliate}/> };
 return <><nav className="breadcrumb" aria-label={t.home}><Link href={localePath(locale)}>{t.home}</Link><span aria-hidden="true">/</span><span>{t[kind]}</span></nav><article className="prose"><h1>{article.title}</h1>{!article.translated && <p className="translation-notice" role="status">{t.fallback}</p>}<DiscussionProvider key={`${kind}/${slug}/${article.contentLocale}`} articleKind={kind} articleSlug={slug} contentLocale={article.contentLocale} locale={locale}><div className={bodyClass} lang={article.contentLocale}><MDXRemote source={article.content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeArticleAnchors, { ids: articleHeadingIds(kind, slug, article.contentLocale) }], [rehypeAutolinkHeadings, { behavior: 'wrap' }], ...(bodyClass ? [rehypeArticleLayout] : []), rehypeDiscussions], format: 'mdx' } }}/></div></DiscussionProvider></article><div className="article-navigation"><TopicIndex locale={locale}/></div>{schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>}</>;
}
