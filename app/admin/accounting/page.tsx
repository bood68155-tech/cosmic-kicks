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
        )}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400/50 hover:text-red-300">✕</button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
          </div>
        ) : activeTab === 'dashboard' ? (
          <DashboardTab entries={entries} accounts={accounts} />
        ) : activeTab === 'entries' ? (
          <EntriesTab entries={entries} onReverse={handleReverseEntry} />
        ) : activeTab === 'accounts' ? (
          <AccountsTab accounts={accounts} />
        ) : (
          <ProcessTab
            orderId={orderId} setOrderId={setOrderId}
            orderTotal={orderTotal} setOrderTotal={setOrderTotal}
            orderSubtotal={orderSubtotal} setOrderSubtotal={setOrderSubtotal}
            orderShipping={orderShipping} setOrderShipping={setOrderShipping}
            orderTax={orderTax} setOrderTax={setOrderTax}
            orderItems={orderItems} setOrderItems={setOrderItems}
            orderCost={orderCost} setOrderCost={setOrderCost}
            onSubmit={handleProcessOrder} processing={processing} result={processResult}
          />
        )}
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ entries, accounts }: { entries: any[]; accounts: any[] }) {
  const totalRev = accounts.find((a: any) => a.code === '4010')?.balance ?? 0;
  const totalCogs = Math.abs(accounts.find((a: any) => a.code === '5010')?.balance ?? 0);
  const grossProfit = totalRev - totalCogs;
  const margin = totalRev > 0 ? ((grossProfit / totalRev) * 100).toFixed(1) : '0.0';
  
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300/60 text-xs uppercase">Revenue</p>
          <p className="text-emerald-300 text-xl font-bold">${totalRev.toFixed(2)}</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300/60 text-xs uppercase">COGS</p>
          <p className="text-rose-300 text-xl font-bold">${totalCogs.toFixed(2)}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300/60 text-xs uppercase">Gross Profit</p>
          <p className="text-amber-300 text-xl font-bold">${grossProfit.toFixed(2)}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-purple-300/60 text-xs uppercase">Margin</p>
          <p className="text-purple-300 text-xl font-bold">{margin}%</p>
        </div>
      </div>
      <p className="text-white/30 text-xs mt-4">{entries.length} journal entries, {accounts.length} accounts</p>
    </div>
  );
}

// Placeholder for other tabs
function EntriesTab({ entries, onReverse }: { entries: any[]; onReverse: (id: number) => void }) {
  if (!entries.length) return <p className="text-white/40 text-center py-10">No entries</p>;
  return <div className="space-y-2">{entries.map((e: any) => <div key={e.id} className="bg-white/5 rounded-lg p-3 border border-white/10"><p className="text-white text-sm">{e.description}</p></div>)}</div>;
}

function AccountsTab({ accounts }: { accounts: any[] }) {
  if (!accounts.length) return <p className="text-white/40 text-center py-10">No accounts</p>;
  return <table className="w-full"><thead><tr className="text-white/40 text-xs uppercase"><th className="p-2 text-left">Code</th><th className="p-2 text-left">Name</th><th className="p-2 text-right">Balance</th></tr></thead><tbody>{accounts.map((a: any) => <tr key={a.code} className="border-t border-white/5"><td className="p-2 text-white/60 font-mono text-sm">{a.code}</td><td className="p-2 text-white text-sm">{a.name}</td><td className="p-2 text-right text-sm">{a.balance >= 0 ? <span className="text-emerald-300">${a.balance.toFixed(2)}</span> : <span className="text-red-300">-${Math.abs(a.balance).toFixed(2)}</span>}</td></tr>)}</tbody></table>;
}

function ProcessTab(props: any) {
  return <form onSubmit={props.onSubmit} className="space-y-4">
    <input type="text" value={props.orderId} onChange={e => props.setOrderId(e.target.value)} placeholder="Order ID" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
    <input type="number" value={props.orderTotal} onChange={e => props.setOrderTotal(e.target.value)} placeholder="Total" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
    <textarea value={props.orderItems} onChange={e => props.setOrderItems(e.target.value)} placeholder="Items (one per line: name, qty, price, cost)" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono" />
    <button type="submit" disabled={props.processing} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">{props.processing ? 'Processing...' : 'Process Order'}</button>
    {props.result && <p className={props.result.success ? 'text-emerald-300' : 'text-red-300'}>{props.result.message}</p>}
  </form>;
}
