import { HomeContent } from '@/components/StaticPages';
import { requireLocale } from '@/lib/locale-server';
import { messages } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); return pageMetadata('Open Physics Notes', messages(locale).description, '/', locale); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { return <HomeContent locale={requireLocale((await params).locale)}/>; }
