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
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900">
      {/* Header stays sticky via the component itself */}
      <Header onToggle={() => setOpen(true)} />

      {/* Middle row: sidebar | divider | main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar rail (mobile drawer / desktop sticky rail) */}
        <Sidebar chapters={chapters} open={open} onClose={() => setOpen(false)} />

        {/* Transparent black bar between sidebar and main (desktop only) */}
        <div
          className="hidden md:block w-px bg-black/30 self-stretch pointer-events-none"
          aria-hidden="true"
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:pl-6">{children}</div>
        </main>
      </div>

      {/* Footer pinned to bottom */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} OpenPhysicsNotes
        </div>
      </footer>
    </div>
  );
}
