import { PrivacyContent } from '@/components/StaticPages';
import { requireLocale } from '@/lib/locale-server';
import { messages } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); const t = messages(locale); return pageMetadata(t.privacy, t.overviewText, '/privacy', locale); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { return <PrivacyContent locale={requireLocale((await params).locale)}/>; }
