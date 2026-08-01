'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import CartIcon from '@/app/components/CartIcon';
import { LogIn, LogOut, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Sneakers', href: '/#sneakers' },
  { label: 'Classics', href: '/#classics' },
  { label: 'Boots', href: '/#boots' },
];

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  return (
    <>
      <header className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] text-lg transition-all group-hover:border-white/[0.15] group-hover:shadow-[0_0_12px_rgba(255,255,255,0.06)]">
              <span className="relative z-10">+</span>
            </span>
            <span className="font-heading text-sm font-semibold tracking-wide text-white/80 transition-colors group-hover:text-white/90">Cosmic Kicks</span>
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="relative text-xs font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-white/30 after:transition-all after:duration-300 hover:after:w-full">{item.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Admin dashboard link — strictly hidden unless the exact
                    admin account is successfully logged in. */}
                {isAdmin && (
                  <Link href="/admin" className="hidden items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-purple-200 transition-all hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white sm:inline-flex">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Link>
                )}
                <div className="hidden items-center gap-2 md:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/15 text-[10px] font-semibold uppercase text-purple-200">
                    {(user?.name || 'U').charAt(0)}
                  </span>
                  <span className="max-w-[120px] truncate text-[11px] font-medium text-white/60">
                    {user?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/40 transition-colors hover:text-red-300"
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-widest text-purple-200 transition-all hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white">
                <LogIn className="h-3 w-3" />
                Login
              </Link>
            )}
            <CartIcon />
          </div>
        </div>
      </header>

      <nav className="glass-nav--solid flex items-center justify-center gap-6 py-3 sm:hidden">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} href={item.href} className="text-[11px] font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70">{item.label}</Link>
        ))}
      </nav>
    </>
  );
}
