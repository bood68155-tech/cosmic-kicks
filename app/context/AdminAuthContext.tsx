'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface AdminAuthContextValue {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { isAdmin, login: authLogin, logout: authLogout } = useAuth();

  // Admin access is only granted when the hardcoded admin account is used.
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const res = await authLogin(email, password);
      return res.success && res.isAdmin;
    },
    [authLogin],
  );

  const logout = useCallback(() => authLogout(), [authLogout]);

  const value = useMemo(
    () => ({ isLoggedIn: isAdmin, isAdmin, login, logout }),
    [isAdmin, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
