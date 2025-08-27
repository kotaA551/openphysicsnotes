'use client';

import { useState } from 'react';
import Link from 'next/link';
import { chapters } from '@/lib/mdx';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-3 h-12 flex items-center gap-3">
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

          <span className="font-semibold">OpenPhysicsNotes</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 mx-auto max-w-6xl w-full flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-[30%] border-r">
          <div className="p-4">
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

        {/* Main */}
        <main className="w-full md:w-[70%]">{children}</main>
      </div>

      {/* Mobile Drawer + Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
      >
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
