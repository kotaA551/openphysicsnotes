// /components/SiteShell.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import { curiosities } from '@/lib/curiosities';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="w-full h-12 flex items-center gap-3 px-0">
          {/* Hamburger (mobile) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-controls="mobile-sidebar"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex flex-col justify-center gap-1.5 p-2"
          >
            <span className="block h-0.5 w-6 bg-gray-800"></span>
            <span className="block h-0.5 w-6 bg-gray-800"></span>
            <span className="block h-0.5 w-6 bg-gray-800"></span>
          </button>

          <Link
            href="/"
            aria-label="Go to home"
            className="flex items-center gap-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded px-1"
          >
            <Image
              src="/opn-logo-mark-512.png"
              alt="Open Physics Notes logo"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="text-lg font-bold">Open Physics Notes</span>
          </Link>

        </div>
      </header>

      {/* Body */}
      <div className="flex-1 w-full flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-[20%] border-r border-black/20">
          <div className="sticky top-12 h-[calc(100dvh-3rem)] overflow-y-auto py-4 px-4">
            {/* Chapters */}
            <h2 className="font-semibold mb-3">Chapters</h2>
            <nav className="space-y-2">
              {chapters.map((c) => {
                const href = `/chapters/${c.slug}`;
                const active = isActive(href);
                return (
                  <div key={c.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`hover:opacity-80 ${
                        active ? 'font-semibold text-black' : 'text-black'
                      }`}
                    >
                      {c.title}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="my-5 h-px w-full bg-black/10" />

            {/* Curiosities */}
            <h2 className="font-semibold mb-3">Curiosities</h2>
            <nav className="space-y-2">
              {curiosities.map((item) => {
                const href = `/curiosities/${item.slug}`;
                const active = isActive(href);
                return (
                  <div key={item.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`hover:opacity-80 ${
                        active ? 'font-semibold text-black' : 'text-black'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="w-full lg:w-[80%] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <footer className="border-t mt-8 py-6 text-sm text-black/70">
        <div className="mx-auto max-w-5xl px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </nav>
        </div>
      </footer>


      {/* Mobile Drawer + Overlay */}
      <div className={`fixed inset-0 z-50 xl:hidden ${open ? '' : 'pointer-events-none'}`}>
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
            <h2 className="font-semibold">Menu</h2>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2"
            >
              ✕
            </button>
          </div>

          {/* Mobile: Chapters */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">Chapters</h3>
            <nav className="space-y-3">
              {chapters.map((c) => {
                const href = `/chapters/${c.slug}`;
                const active = isActive(href);
                return (
                  <div key={c.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`hover:opacity-80 ${
                        active ? 'font-semibold text-black' : 'text-black'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {c.title}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Mobile divider */}
          <div className="mx-4 h-px bg-black/10" />

          {/* Mobile: Curiosities */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">Curiosities</h3>
            <nav className="space-y-3">
              {curiosities.map((item) => {
                const href = `/curiosities/${item.slug}`;
                const active = isActive(href);
                return (
                  <div key={item.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`hover:opacity-80 ${
                        active ? 'font-semibold text-black' : 'text-black'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
