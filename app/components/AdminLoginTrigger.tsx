'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { KeyRound } from 'lucide-react';

interface AdminLoginTriggerProps {
  className?: string;
}

export default function AdminLoginTrigger({ className = '' }: AdminLoginTriggerProps) {
  const { isLoggedIn } = useAdminAuth();

  // Hide completely when logged in (AdminNavLink takes over)
  if (isLoggedIn) return null;

  return (
    <Link
      href="/admin/login"
      className={`flex items-center justify-center rounded-lg p-1.5 text-white/15 transition-all hover:text-white/40 hover:bg-white/[0.03] ${className}`}
      title="Admin Login"
    >
      <KeyRound size={14} />
    </Link>
  );
}
