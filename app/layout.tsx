// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  title: 'OpenPhysicsNotes',
  description: 'Open physics notes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
