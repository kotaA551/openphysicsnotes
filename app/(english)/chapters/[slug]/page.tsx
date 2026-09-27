import ArticlePage, { articleMetadata } from '@/components/ArticlePage';
import { articleList } from '@/lib/articles';
export const dynamicParams = false;
export function generateStaticParams() { return articleList('chapters').map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return articleMetadata('chapters', (await params).slug, 'en'); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ArticlePage kind="chapters" slug={(await params).slug} locale="en"/>; }
