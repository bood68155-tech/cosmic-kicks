'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

const EMAIL_STORAGE_KEY = 'cosmic-kicks-admin-email';
const AUTHORIZED_ADMIN_EMAILS = ['bood68155@gmail.com'];

interface AdminAuthContextValue {
  isLoggedIn: boolean;
  adminEmail: string | null;
  isAdmin: boolean;
  login: (email: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function loadEmailFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const email = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (email && AUTHORIZED_ADMIN_EMAILS.includes(email)) {
      return email;
    }
    return null;
  } catch {
    return null;
  }
}

function saveEmailToStorage(email: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (email) {
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
    } else {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    }
  } catch {}
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(loadEmailFromStorage);

  const isLoggedIn = adminEmail !== null;

  const isAdmin = useMemo(
    () => adminEmail !== null && AUTHORIZED_ADMIN_EMAILS.includes(adminEmail),
    [adminEmail]
  );

  const login = useCallback(
    (email: string): boolean => {
      const trimmed = email.trim().toLowerCase();
      if (AUTHORIZED_ADMIN_EMAILS.includes(trimmed)) {
        setAdminEmail(trimmed);
        saveEmailToStorage(trimmed);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setAdminEmail(null);
    saveEmailToStorage(null);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, adminEmail, isAdmin, login, logout }),
    [isLoggedIn, adminEmail, isAdmin, login, logout]
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
