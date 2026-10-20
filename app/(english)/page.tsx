import { HomeContent } from '@/components/StaticPages';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/i18n';
export const metadata = pageMetadata('Open Physics Notes', messages('en').description, '/', 'en');
export default function Page() { return <HomeContent locale="en"/>; }
