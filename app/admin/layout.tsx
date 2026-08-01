'use client';

import { ReactNode } from 'react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  LogOut,
  Shield,
} from 'lucide-react';

function AdminNav() {
  const { isLoggedIn, logout } = useAdminAuth();
  const pathname = usePathname();

  if (!isLoggedIn) return null;

  const navItems = [
    { href: '/admin', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { href: '/admin/accounting', label: 'Accounting', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-black/40 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Cosmic Kicks Admin</span>
            </Link>
            <div className="w-px h-6 bg-white/10 mx-2" />
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                    isActive
                      ? 'text-purple-300 bg-purple-500/10'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <AdminNav />
        {children}
      </div>
  );
}
