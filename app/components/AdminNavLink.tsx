'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/app/context/AdminAuthContext';

interface AdminNavLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AdminNavLink({ className = '', children }: AdminNavLinkProps) {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) return null;

  const defaultContent = children || 'Admin';

  return (
    <Link href="/admin" className={className}>
      {defaultContent}
    </Link>
  );
}
