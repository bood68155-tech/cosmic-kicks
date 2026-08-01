'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { Shield, Lock, LogIn, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const { isLoggedIn, login } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/admin');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = login(username, password, email || undefined);
    setLoading(false);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#ededed] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm text-white/40">Sign in to manage your Cosmic Kicks store.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-white/50 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.05]"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.05]"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/50 uppercase tracking-wider">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={14} className="text-white/30" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-9 pr-4 py-3 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.05]"
                placeholder="e.g. bood68155@gmail.com"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-white/30">Enter the authorized admin email to enable the Admin link in navigation.</p>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-4 text-center text-[11px] text-white/40">
            Demo credentials: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
