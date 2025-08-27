'use client';

import { useState } from 'react';
import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header — full-bleed & no left gap */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
        <div className="w-full h-12 flex items-center gap-3 px-0">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-controls="mobile-sidebar"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex flex-col justify-center gap-1.5 p-2"
          >
            <span className="block h-0.5 w-6 bg-gray-800"></span>
            <span className="block h-0.5 w-6 bg-gray-800"></span>
            <span className="block h-0.5 w-6 bg-gray-800"></span>
          </button>

          <Link
            href="/"
            aria-label="Go to home"
            className="font-semibold hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded px-1"
          >
            Open Physics Notes
          </Link>
        </div>
      </header>

      {/* Body — full-bleed */}
      <div className="flex-1 w-full flex">
        {/* Sidebar (desktop) — flush-left, subtle divider */}
        <aside className="hidden md:block w-[30%] border-r border-black/20">
          {/* remove left padding; keep right & vertical */}
          <div className="py-4 pr-4">
            <h2 className="font-semibold mb-3">Chapters</h2>
            <nav className="space-y-2">
              {chapters.map((c) => (
                <div key={c.slug}>
                  <Link
                    href={`/chapters/${c.slug}`}
                    className="text-black visited:text-black underline underline-offset-2 hover:no-underline"
                  >
                    {c.title}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main — use padding (no margins) for spacing */}
        <main className="w-full md:w-[70%] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer + Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        {/* Drawer */}
        <aside
          id="mobile-sidebar"
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl border-r 
          transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="font-semibold">Chapters</h2>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2"
            >
              ✕
            </button>
          </div>
          <nav className="p-4 space-y-3">
            {chapters.map((c) => (
              <div key={c.slug}>
                <Link
                  href={`/chapters/${c.slug}`}
                  className="text-black visited:text-black underline underline-offset-2 hover:no-underline"
                  onClick={() => setOpen(false)}
                >
                  {c.title}
                </Link>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
