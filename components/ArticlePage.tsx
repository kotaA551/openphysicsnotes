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
import { hasTranslation, loadArticle, type ArticleKind } from '@/lib/articles';
import { locales, localePath, messages, type Locale } from '@/lib/i18n';
import { pageMetadata, siteUrl } from '@/lib/seo';
export function articleMetadata(kind: ArticleKind, slug: string, locale: Locale) {
 const article = loadArticle(kind, slug, locale); if (!article) notFound();
 const result = pageMetadata(article.title, article.description, `/${kind}/${slug}`, locale, article.translated);
 // Only publish hreflang entries for actual translated article content.
 if (article.translated && result.alternates) result.alternates.languages = Object.fromEntries([
  ...locales.filter(language => hasTranslation(kind, slug, language)).map(language => [language, localePath(language, `/${kind}/${slug}`)]),
  ['x-default', `/${kind}/${slug}`],
 ]);
 return result;
}
export default function ArticlePage({ kind, slug, locale }: { kind: ArticleKind; slug: string; locale: Locale }) {
 const article = loadArticle(kind, slug, locale); if (!article) notFound();
 const t = messages(locale);
 const schema = { '@context': 'https://schema.org', '@type': 'LearningResource', name: article.title, description: article.description, inLanguage: article.contentLocale, url: siteUrl + (article.translated ? localePath(locale, `/${kind}/${slug}`) : `/${kind}/${slug}`), isAccessibleForFree: true, learningResourceType: 'Lecture notes', publisher: { '@type': 'Organization', name: 'Open Physics Notes' } };
 const components = { Callout, RelatedBooks: (props: React.ComponentProps<typeof RelatedBooks>) => <RelatedBooks {...props} heading={t.reading}/>, AffiliateNote: () => <AffiliateNote text={t.affiliate}/> };
 return <><nav className="breadcrumb" aria-label={t.home}><Link href={localePath(locale)}>{t.home}</Link><span aria-hidden="true">/</span><span>{t[kind]}</span></nav><article className="prose"><h1>{article.title}</h1>{!article.translated && <p className="translation-notice" role="status">{t.fallback}</p>}<div lang={article.contentLocale}><MDXRemote source={article.content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]], format: 'mdx' } }}/></div></article><div className="article-navigation"><TopicIndex locale={locale}/></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/></>;
}
