import { AboutContent } from '@/components/StaticPages';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/i18n';
export const metadata = pageMetadata(messages('en').about, messages('en').aboutText, '/about', 'en');
export default function Page() { return <AboutContent locale="en"/>; }
