import ArticlePage, { articleMetadata } from '@/components/ArticlePage';
import { articleList } from '@/lib/articles';
export const dynamicParams = false;
export function generateStaticParams() { return articleList('curiosities').map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return articleMetadata('curiosities', (await params).slug, 'en'); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ArticlePage kind="curiosities" slug={(await params).slug} locale="en"/>; }
