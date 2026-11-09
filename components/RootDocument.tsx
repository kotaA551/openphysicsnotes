import '@/app/globals.css';
import type { Locale } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import 'katex/dist/katex.min.css';
import Script from 'next/script';
import { themeInitScript } from '@/lib/theme';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Open Physics Notes',
    template: '%s | Open Physics Notes',
  },

  description:
    'Free physics notes, from classical mechanics to quantum theory.',

  manifest: '/manifest.webmanifest',

  icons: {
    icon: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],

    shortcut: ['/favicon.ico'],
  },

  appleWebApp: {
    capable: true,
    title: 'Open Physics Notes',
    statusBarStyle: 'default',
  },
};

export default function RootDocument({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script id="opn-theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }}/>
      </head>
      <body>
        {/* Google Analytics (GA4) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // GA4 Enhanced Measurement owns history-based page views.
              // Configure once; do not also send route-change page views here.
              gtag('config', '${gaId}');
            `}</Script>

          </>
        )}

        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

