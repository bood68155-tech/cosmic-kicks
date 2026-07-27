'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Receipt,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type Tab = 'dashboard' | 'entries' | 'accounts' | 'process';

interface JournalEntry {
  id: number;
  entry_date: string;
  reference_id: string | null;
  description: string;
  is_posted: boolean;
  posted_at: string | null;
  created_at: string;
  lines?: JournalEntryLine[];
  total_debits?: number;
  total_credits?: number;
}

interface JournalEntryLine {
  id: number;
  account_code: string;
  account_name: string;
  entry_type: 'debit' | 'credit';
  amount: number;
  description: string | null;
}

interface AccountSummary {
  code: string;
  name: string;
  type: string;
  total_debits: number;
  total_credits: number;
  balance: number;
}

interface ProcessResult {
  success: boolean;
  message: string;
  journal_entry_id?: number;
  error?: string;
}

export default function AccountingPage() {
  const { isLoggedIn } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Process order form state
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState('');
  const [orderSubtotal, setOrderSubtotal] = useState('');
  const [orderShipping, setOrderShipping] = useState('');
  const [orderTax, setOrderTax] = useState('');
  const [orderItems, setOrderItems] = useState('');
  const [orderCost, setOrderCost] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesRes, accountsRes] = await Promise.all([
        fetch('/api/accounting/entries'),
        fetch('/api/accounting/accounts'),
      ]);

      if (!entriesRes.ok || !accountsRes.ok) {
        throw new Error('Failed to fetch accounting data. Ensure Supabase is configured.');
      }

      const entriesData = await entriesRes.json();
      const accountsData = await accountsRes.json();

      setEntries(entriesData.entries ?? []);
      setAccounts(accountsData.accounts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounting data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setProcessResult(null);

    const items = orderItems.split('\n').filter(Boolean).map((line) => {
      const [name, qty, price, cost] = line.split(',').map((s) => s.trim());
      return {
        product_id: name.toLowerCase().replace(/\s+/g, '_'),
        product_name: name,
        quantity: Number(qty) || 1,
        unit_price: Number(price) || 0,
        unit_cost: Number(cost) || 0,
      };
    });

    const orderPayload = {
      id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      total_amount: Number(orderTotal),
      subtotal: Number(orderSubtotal),
      shipping_amount: Number(orderShipping) || undefined,
      tax_amount: Number(orderTax) || undefined,
      items,
    };

    try {
      const res = await fetch('/api/accounting/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await res.json();
      setProcessResult(result);
      if (result.success) {
        setSuccessMsg(`Entry created: ${result.message}`);
        fetchData();
      }
    } catch (err) {
      setProcessResult({
        success: false,
        message: 'Network error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReverseEntry = async (entryId: number) => {
    if (!confirm(`Reverse journal entry #${entryId}? This will create an offsetting entry.`)) {
      return;
    }
    try {
      const res = await fetch('/api/accounting/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journal_entry_id: entryId,
          reason: 'Manual reversal from admin dashboard',
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg(`Reversal entry created: ${result.message}`);
        fetchData();
      } else {
        setError(result.error ?? 'Reversal failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reversal failed');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'entries', label: 'Journal Entries', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'accounts', label: 'Account Balances', icon: <Receipt className="w-4 h-4" /> },
    { id: 'process', label: 'Process Order', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Accounting Ledger
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Double-entry bookkeeping engine — automated journal entries
              </p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-300 border-purple-400'
                    : 'text-white/40 border-transparent hover:text-white/70 hover:border-white/20'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Flash Messages */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {successMsg && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {successMsg}
            <button onClick={() => setSuccessMsg(null)} className="ml-auto text-emerald-400/50 hover:text-emerald-300">✕</button>
          </div>
        
