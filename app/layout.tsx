import './globals.css';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import type { Metadata } from 'next';


export const metadata: Metadata = {
title: 'Quantum Gravity Notes',
description: 'Open, beginner-friendly notes toward quantum gravity.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen bg-zinc-50 text-zinc-900">
<header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
<div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-4">
<Link href="/" className="font-bold">QG Notes</Link>
<nav className="text-sm flex gap-3">
<Link href="/">Home</Link>
<Link href="/tags">Tags</Link>
</nav>
<div className="ml-auto text-xs text-zinc-500">MIT Licensed</div>
</div>
</header>
<main className="mx-auto max-w-3xl px-4 py-8">
{children}
</main>
<footer className="mx-auto max-w-3xl px-4 py-10 text-xs text-zinc-500">
© {new Date().getFullYear()} QG Notes
</footer>
</body>
</html>
);
}