'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type ChapterLink = { slug: string; title: string; description?: string };

export default function Sidebar({
  chapters,
  open,
  onClose,
}: {
  chapters: ChapterLink[];
  open: boolean;
  onClose: () => void;
}) {
  // close with ESC on mobile
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 md:hidden transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* drawer on mobile; static rail on desktop */}
      <aside
        className={`fixed z-40 top-14 bottom-0 w-72 border-r bg-white overflow-y-auto transition-transform
                    md:sticky md:top-14 md:translate-x-0 md:h-[calc(100dvh-3.5rem)]
                    ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <nav className="p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Chapters
          </h2>
          <ul className="space-y-1">
            {chapters.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/chapters/${c.slug}`}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  <div className="font-medium">{c.title}</div>
                  {c.description ? (
                    <div className="text-xs text-zinc-500 line-clamp-1">
                      {c.description}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
