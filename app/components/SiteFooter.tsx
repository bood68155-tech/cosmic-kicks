'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function SiteFooter() {
  const { isAdmin } = useAuth();

  return (
    <footer className="relative border-t border-white/[0.04] bg-black/30 py-12 overflow-hidden">
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-900/5 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-900/5 blur-[80px]" />
      <div className="mx-auto relative max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-heading text-sm font-semibold tracking-wide text-white/60">Cosmic Kicks</span>
          </div>
          <div className="flex items-center gap-6">
            {['Sneakers', 'Classics', 'Boots'].map((item) => (
              <Link key={item} href={'/#' + item.toLowerCase()} className="text-[11px] font-medium uppercase tracking-widest text-white/30 transition-colors hover:text-white/50">{item}</Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-[11px] font-medium uppercase tracking-widest text-white/20 transition-colors hover:text-white/40">Admin</Link>
            )}
          </div>
          <p className="text-xs text-white/40">Designed on Earth. Inspired by the stars. © 2026</p>
        </div>
      </div>
    </footer>
  );
}
