'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, BookOpen, LogOut, Shield } from 'lucide-react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';

function AdminNav() {
  const { isLoggedIn, logout } = useAdminAuth();
  const pathname = usePathname();

  if (!isLoggedIn) return null;

  const tabs = [
    { label: 'Products', href: '/admin', icon: Package },
    { label: 'Accounting', href: '/admin/accounting', icon: BookOpen },
  ];

  return (
    <div className="glass-nav sticky top-0 z-50 border-b border-white/[0.06]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
            <Shield size={16} className="text-purple-400" />
            Cosmic Kicks Admin
          </Link>
          <nav className="flex items-center gap-1">
            {tabs.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-white/[0.08] text-white/90'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/40 transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <AdminNav />
      {children}
    </div>
  );
}
