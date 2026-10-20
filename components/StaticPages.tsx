import Link from 'next/link';
import TopicIndex from './TopicIndex';
import { discussionMessages } from '@/lib/discussions/messages';
import { localePath, messages, type Locale } from '@/lib/i18n';
export function HomeContent({ locale }: { locale: Locale }) {
 const t = messages(locale);
 return <><section className="hero"><p className="eyebrow">{t.eyebrow}</p><h1 translate="no">Open Physics Notes</h1><p className="intro">{t.intro}</p><p className="description">{t.description}</p></section><TopicIndex locale={locale}/></>;
}
export function AboutContent({ locale }: { locale: Locale }) {
 const t = messages(locale);
 return <article className="prose document-page"><p className="eyebrow">{t.about}</p><h1>{t.aboutHeading}</h1><p className="lead">{t.aboutText}</p><p>{t.aboutDetail}</p><Link className="primary-link not-prose" href={localePath(locale)}>{t.start}<span aria-hidden="true">→</span></Link></article>;
}
export function PrivacyContent({ locale }: { locale: Locale }) {
 const t = messages(locale);
 return <article className="prose document-page"><p className="eyebrow" translate="no">Open Physics Notes</p><h1>{t.privacy}</h1><p>{t.updated}: <time dateTime="2026-09-29">2026-09-29</time></p><h2>{t.overview}</h2><p>{t.overviewText}</p><h2>{t.cookies}</h2><p>{t.cookiesText}</p><h2>{t.analytics}</h2><p>{t.analyticsText}</p><h2>{discussionMessages(locale).title}</h2><p>{discussionMessages(locale).privacyText}</p></article>;
}
