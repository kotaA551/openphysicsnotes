import Link from 'next/link';
import { chapters } from '@/lib/chapters';
import { curiosities } from '@/lib/curiosities';
import { localePath, messages, topicTitle, type Locale } from '@/lib/i18n';
export default function TopicIndex({ locale }: { locale: Locale }) {
 const t = messages(locale);
 return <div className="topic-grid">{(['chapters', 'curiosities'] as const).map(kind => <section className="topic-section" key={kind}><h2>{t[kind]}</h2><p>{kind === 'chapters' ? t.chapterIntro : t.curiosityIntro}</p><ol className="topic-list">{(kind === 'chapters' ? chapters : curiosities).map((item, index) => <li key={item.slug}><Link href={localePath(locale, `/${kind}/${item.slug}`)}><span className="nav-number">{String(index + 1).padStart(2, '0')}</span><span>{topicTitle(locale, kind, index)}</span><span className="arrow" aria-hidden="true">↗</span></Link></li>)}</ol></section>)}</div>;
}
