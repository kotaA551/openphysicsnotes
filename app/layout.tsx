import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { getAllChapters } from '@/lib/mdx';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'OpenPhysicsNotes',
  description: 'Open, beginner-friendly notes toward quantum gravity.',
};

export const runtime = 'nodejs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Grab chapter metadata once at the root
  const chapters = getAllChapters().map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description ?? '',
  }));

  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900">
        {/* Header: sticky */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-semibold text-lg hover:opacity-80">
                OpenPhysicsNotes
              </Link>
            </div>
          </div>
        </header>

        {/* Center row: Sidebar 30% | Divider | Main 70% */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar (inline, not fixed) */}
          <aside className="hidden md:block w-[30%] max-w-md overflow-y-auto">
            <div className="mx-auto max-w-md px-4 py-6">
              <h2 className="text-xl font-semibold mb-3">Chapters</h2>
              <nav className="space-y-2">
                {chapters.map((c) => (
                  <div key={c.slug} className="leading-tight">
                  <Link
                    href={`/${c.slug}`}
                    className="text-black visited:text-black underline underline-offset-2 hover:no-underline"
                  >
                    {c.title}
                  </Link>
                    {c.description ? (
                      <p className="text-sm text-zinc-600 mt-0.5">{c.description}</p>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Transparent black divider */}
          <div className="hidden md:block w-px bg-black/30 self-stretch" aria-hidden="true" />

          {/* Main */}
          <main className="flex-1 w-[70%] overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 md:pl-6">{children}</div>
          </main>
        </div>

        {/* Footer pinned to bottom */}
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-10 text-xs text-zinc-500">
            © {new Date().getFullYear()} OpenPhysicsNotes
          </div>
        </footer>
      </body>
    </html>
  );
}
