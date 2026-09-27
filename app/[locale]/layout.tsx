import RootDocument from '@/components/RootDocument';
import { locales } from '@/lib/i18n';
import { requireLocale } from '@/lib/locale-server';
export { metadata } from '@/components/RootDocument';
export const dynamicParams = false;
export function generateStaticParams() { return locales.filter(locale => locale !== 'en').map(locale => ({ locale })); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { return <RootDocument locale={requireLocale((await params).locale)}>{children}</RootDocument>; }
