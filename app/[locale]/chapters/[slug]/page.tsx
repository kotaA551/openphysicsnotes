import ArticlePage, { articleMetadata } from '@/components/ArticlePage';
import { articleList } from '@/lib/articles';
import { requireLocale } from '@/lib/locale-server';
export const dynamicParams = false;
export function generateStaticParams() { return articleList('chapters').map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) { const p = await params; return articleMetadata('chapters', p.slug, requireLocale(p.locale)); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) { const p = await params; return <ArticlePage kind="chapters" slug={p.slug} locale={requireLocale(p.locale)}/>; }
