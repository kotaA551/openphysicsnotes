import { PrivacyContent } from '@/components/StaticPages';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/i18n';
export const metadata = pageMetadata(messages('en').privacy, messages('en').overviewText, '/privacy', 'en');
export default function Page() { return <PrivacyContent locale="en"/>; }
