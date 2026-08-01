'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

const AUTH_STORAGE_KEY = 'cosmic-kicks-auth';
const EMAIL_STORAGE_KEY = 'cosmic-kicks-admin-email';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin123';
const AUTHORIZED_ADMIN_EMAILS = ['bood68155@gmail.com'];

interface AdminAuthContextValue {
  isLoggedIn: boolean;
  adminEmail: string | null;
  isAdmin: boolean;
  login: (username: string, password: string, email?: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function loadFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function loadEmailFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(EMAIL_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveToStorage(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, String(value));
  } catch {}
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
  const [isLoggedIn, setIsLoggedIn] = useState(loadFromStorage());
  const [adminEmail, setAdminEmail] = useState<string | null>(loadEmailFromStorage);

  const isAdmin = useMemo(
    () => isLoggedIn && adminEmail !== null && AUTHORIZED_ADMIN_EMAILS.includes(adminEmail),
    [isLoggedIn, adminEmail]
  );

  const login = useCallback(
    (username: string, password: string, email?: string): boolean => {
      if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        setIsLoggedIn(true);
        saveToStorage(true);
        if (email) {
          setAdminEmail(email);
          saveEmailToStorage(email);
        }
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setAdminEmail(null);
    saveToStorage(false);
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
