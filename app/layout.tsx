import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { getAllChapters } from '@/lib/mdx';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  title: 'OpenPhysicsNotes',
  description: 'Open, beginner-friendly notes toward quantum gravity.',
};

export const runtime = 'nodejs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const chapters = getAllChapters().map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description ?? '',
  }));

  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900">
        <SiteShell chapters={chapters}>{children}</SiteShell>
      </body>
    </html>
  );
}
