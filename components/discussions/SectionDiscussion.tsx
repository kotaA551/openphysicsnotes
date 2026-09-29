'use client';
import { useId, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDiscussion } from './DiscussionProvider';
const DiscussionPanel = dynamic(() => import('./DiscussionPanel'), { ssr: false });
export default function SectionDiscussion({ sectionId }: { sectionId: string }) {
  const { t, counts, locale } = useDiscussion();
  const [opened, setOpened] = useState(false);
  const label = useId();
  return <details className="section-discussion not-prose" lang={locale} data-nosnippet onToggle={event => { if (event.currentTarget.open) setOpened(true); }}>
    <summary id={label}><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><path d="m7 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{t.title}</span>{counts[sectionId] > 0 && <span className="discussion-count">({counts[sectionId]})</span>}</summary>
    {opened && <div role="region" aria-labelledby={label}><DiscussionPanel sectionId={sectionId}/></div>}
  </details>;
}
