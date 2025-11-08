'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    window.gtag?.('config', GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}
