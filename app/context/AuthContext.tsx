'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

/* ─── Constants ─── */

const SESSION_KEY = 'cosmic-kicks-session';
const USERS_KEY = 'cosmic-kicks-users';

// Hardcoded admin account — the exact email/password combination that
// grants admin privileges.
export const ADMIN_EMAIL = 'bood68155@gmail.com';
const ADMIN_PASSWORD = '12341234';

/* ─── Types ─── */

export interface AuthUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
}

export interface LoginResult {
  success: boolean;
  isAdmin: boolean;
  error?: string;
}

export interface SignupResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  logout: () => void;
}

/* ─── Storage helpers ─── */

function safeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function makeToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const raw = `${salt}::${password}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback for non-secure contexts where crypto.subtle is unavailable.
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `fallback-${hash.toString(16)}`;
}

function loadSession(): AuthUser | null {
  const store = safeLocalStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { name?: string; email?: string; isAdmin?: boolean; token?: string };
    if (parsed && typeof parsed.email === 'string' && typeof parsed.token === 'string') {
      return { name: parsed.name ?? 'User', email: parsed.email, isAdmin: !!parsed.isAdmin };
    }
  } catch {
    // Corrupt session — ignore.
  }
  return null;
}

function saveSession(user: AuthUser): void {
  const store = safeLocalStorage();
  if (!store) return;
  try {
    store.setItem(SESSION_KEY, JSON.stringify({ ...user, token: makeToken() }));
  } catch {
    // Storage unavailable.
  }
}

function clearSession(): void {
  const store = safeLocalStorage();
  if (!store) return;
  try {
    store.removeItem(SESSION_KEY);
  } catch {}
}

function loadUsers(): StoredUser[] {
  const store = safeLocalStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  const store = safeLocalStorage();
  if (!store) return;
  try {
    store.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── Context ─── */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy-initialize the session from localStorage (returns null during SSR,
  // and during hydration the client picks the stored session right away).
  const [user, setUser] = useState<AuthUser | null>(loadSession);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const normalized = normalizeEmail(email);
      if (!EMAIL_RE.test(normalized)) {
        return { success: false, isAdmin: false, error: 'Please enter a valid email address.' };
      }

      // Hardcoded admin check.
      if (normalized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const admin: AuthUser = { name: 'Admin', email: ADMIN_EMAIL, isAdmin: true };
        setUser(admin);
        saveSession(admin);
        return { success: true, isAdmin: true };
      }

      // Registered user check.
      const users = loadUsers();
      const match = users.find((u) => u.email === normalized);
      if (match) {
        const hash = await hashPassword(password, match.salt);
        if (hash === match.passwordHash) {
          const sessionUser: AuthUser = { name: match.name, email: match.email, isAdmin: false };
          setUser(sessionUser);
          saveSession(sessionUser);
          return { success: true, isAdmin: false };
        }
      }

      return { success: false, isAdmin: false, error: 'Invalid email or password.' };
    },
    [],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<SignupResult> => {
      const trimmedName = name.trim();
      const normalized = normalizeEmail(email);

      if (!trimmedName) return { success: false, error: 'Please enter your name.' };
      if (!EMAIL_RE.test(normalized)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      if (normalized === ADMIN_EMAIL) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const users = loadUsers();
      if (users.some((u) => u.email === normalized)) {
        return { success: false, error: 'An account with this email already exists. Try signing in instead.' };
      }

      const salt = makeToken();
      const passwordHash = await hashPassword(password, salt);
      saveUsers([...users, { name: trimmedName, email: normalized, passwordHash, salt }]);

      const sessionUser: AuthUser = { name: trimmedName, email: normalized, isAdmin: false };
      setUser(sessionUser);
      saveSession(sessionUser);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      isAdmin: user?.isAdmin === true,
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
