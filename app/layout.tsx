// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import 'katex/dist/katex.min.css';
import Script from 'next/script';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'OpenPhysicsNotes',
  description: 'Open physics notes',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body>
        {/* Google Analytics (GA4) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
            >{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}</Script>
          </>
        )}

        <SiteShell>{children}</SiteShell>

        {gaId && <Analytics />}
      </body>
    </html>
  );
}