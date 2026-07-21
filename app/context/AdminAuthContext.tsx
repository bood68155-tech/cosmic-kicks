'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

const AUCHLLOCALE_KEY = 'cosmic-kicks-auth';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin123';

interface AdminAuthContextValue {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function loadFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AUCHLLOCALE_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveToStorage(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUCHLLOCALE_KEY, String(value));
  } catch {}
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(loadFromStorage());

  const login = useCallback(
(username: string, password: string): boolean => {
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      saveToStorage(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    saveToStorage(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout]
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
