import { PrivacyContent } from '@/components/StaticPages';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/i18n';
const t = messages('en');
export const metadata = pageMetadata(t.privacy, t.overviewText, '/privacy', 'en');
export default function Page() { return <PrivacyContent locale="en"/>; }
