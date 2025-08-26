'use client';

import Link from 'next/link';

export default function Header({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center gap-3">
        {/* hamburger only on mobile */}
        <button
          onClick={onToggle}
          aria-label="Open menu"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-zinc-50"
        >
          <span className="block h-[2px] w-4 bg-zinc-800" />
          <span className="block h-[2px] w-4 bg-zinc-800 mt-1" />
          <span className="block h-[2px] w-4 bg-zinc-800 mt-1" />
        </button>

        <Link href="/" className="font-bold tracking-tight">
          OpenPhysicsNotes
        </Link>
      </div>
    </header>
  );
}
