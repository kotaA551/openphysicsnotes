'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type ChapterLink = { slug: string; title: string; description?: string };

export default function SiteShell({
  chapters,
  children,
}: {
  chapters: ChapterLink[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header onToggle={() => setOpen(true)} />
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[18rem_1fr]">
        <Sidebar chapters={chapters} open={open} onClose={() => setOpen(false)} />
        <main className="min-h-[calc(100dvh-3.5rem)] px-4 py-6 md:pl-6">{children}</main>
      </div>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">
        © {new Date().getFullYear()} OpenPhysicsNotes
      </footer>
    </>
  );
}
