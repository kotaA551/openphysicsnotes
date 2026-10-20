'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { discussionGroupMessages } from '@/lib/discussions/messages';
import { useDiscussion } from './DiscussionProvider';
const DiscussionPanel = dynamic(() => import('./DiscussionPanel'), { ssr: false });
export default function SectionDiscussion({ sectionId, choicesJSON }: { sectionId: string; choicesJSON: string }) {
  const { t, counts, locale, anchor } = useDiscussion();
  const copy = discussionGroupMessages(locale);
  const choices: { id: string; label: string }[] = useMemo(() => JSON.parse(choicesJSON), [choicesJSON]);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(sectionId);
  const [posted, setPosted] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);
  const label = useId();
  const total = choices.reduce((sum, choice) => sum + (counts[choice.id] || 0), 0);
  useEffect(() => {
    const target = choices.find(choice => anchor === `discussion-${choice.id}`);
    if (target) {
      setSelected(target.id); setOpened(true);
      if (details.current) { details.current.open = true; details.current.scrollIntoView({ block: 'nearest' }); }
    }
  }, [anchor, choices]);
  return <details ref={details} id={`discussion-${sectionId}`} className="section-discussion not-prose" lang={locale} data-nosnippet data-discussion-section={sectionId} onToggle={event => {
    if (event.currentTarget.open && !opened) {
      // Open one populated location; selecting another makes one paged request.
      setSelected(choices.find(choice => counts[choice.id] > 0)?.id || sectionId);
      setOpened(true);
    }
  }}>
    <summary id={label}><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><path d="m7 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{t.title}</span>{total > 0 && <span className="discussion-count">({total})</span>}</summary>
    {opened && <div role="region" aria-labelledby={label}>
      {choices.length > 1 && <div className="discussion-locations">
        <label htmlFor={`${label}-location`}>{copy.locations}</label>
        <select id={`${label}-location`} value={selected} onChange={event => { setPosted(false); setSelected(event.target.value); }}>{choices.map(choice => <option key={choice.id} value={choice.id}>{choice.label}{counts[choice.id] > 0 ? ` (${counts[choice.id]})` : ''}</option>)}</select>
        <p><a href={`#${selected}`}>{choices.find(choice => choice.id === selected)?.label}</a></p>
        <p>{copy.newQuestions} <a href={`#${sectionId}`}>{choices[0].label}</a></p>
      </div>}
      {posted && <p role="status" className="discussion-note">{t.posted}</p>}
      <DiscussionPanel key={selected} sectionId={selected} postSectionId={sectionId} onRootPosted={() => { if (selected !== sectionId) setPosted(true); setSelected(sectionId); }}/>
    </div>}
  </details>;
}
