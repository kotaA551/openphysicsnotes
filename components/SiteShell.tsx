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
      {/* Header */}
      <Header onToggle={() => setOpen(true)} />

      {/* Center row: sidebar 30% | divider | main 70% */}
      <div className="flex flex-row flex-1 min-h-0">
        {/* Sidebar (now inline, 30%) */}
        <aside className="hidden md:block w-1/3 max-w-sm overflow-y-auto border-r border-black/30">
          <Sidebar chapters={chapters} open={open} onClose={() => setOpen(false)} />
        </aside>

        {/* Main (70%) */}
        <main className="flex-1 w-2/3 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:pl-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} OpenPhysicsNotes
        </div>
      </footer>
    </div>
  );
}
