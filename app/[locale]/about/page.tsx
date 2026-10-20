import { AboutContent } from '@/components/StaticPages';
import { requireLocale } from '@/lib/locale-server';
import { messages } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); const t = messages(locale); return pageMetadata(t.about, t.aboutText, '/about', locale); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { return <AboutContent locale={requireLocale((await params).locale)}/>; }
