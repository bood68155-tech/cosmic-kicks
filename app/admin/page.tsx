'use client';

import { useState, useMemo, useCallback } from 'react';
import { AdminProvider, useAdmin } from '@/app/context/AdminContext';
import type { Product } from '@/app/data/products';
import {
  Plus, Pencil, Trash2, Search, X, Save,
  LayoutDashboard, Package, Check, AlertCircle, ArrowUpDown,
} from 'lucide-react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const emptyProduct = {
  name: '', category: 'sneakers' as const, price: 0,
  description: '', details: [''], materials: '', image: '',
  accent: '#8B5CF6', cosmicTier: 'stellar' as const,
};

const TIERS = ['stellar', 'nebula', 'supernova'] as const;
const CATS: Record<string, string> = { sneakers: 'Sneakers', classic: 'Classics', boots: 'Boots' };

function AdminContent() {
  const { isLoggedIn } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const { products, addProduct, updateProduct, deleteProduct, lastUpdated } = useAdmin();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = useCallback((msg: string, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filtered = useMemo(() => {
    let items = [...products];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => {
      const aVal = (a as any)[sortKey] || '';
      const bVal = (b as any)[sortKey] || '';
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [products, search, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const openAdd = () => {
    setForm({ ...emptyProduct });
    setEditId(null);
    setModal('add');
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      details: [...p.details],
      materials: p.materials,
      image: p.image,
      accent: p.accent,
      cosmicTier: p.cosmicTier,
    });
    setEditId(p.id);
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (editId) {
      updateProduct(editId, form);
      showToast('Product updated');
    } else {
      addProduct({ id: '', ...form });
      showToast('Product added');
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteId(null);
    showToast('Product deleted');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#ededed]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <LayoutDashboard className="mr-3 inline-block h-8 w-8 text-purple-400" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/40">
              {products.length} products
              {lastUpdated && (
                <>
                  {' \u00b7 '}All changes saved locally
                </>
              )}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.05]"
            />
          </div>
          <div className="flex items-center gap-2">
            {['name', 'price', 'category', 'cosmicTier'].map((key) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-all ${
                  sortKey === key
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                }`}
              >
                {key === 'cosmicTier' ? 'Tier' : key}
                {sortKey === key && (
                  <ArrowUpDown
                    size={12}
                    className={`transition-transform ${
                      sortDir === 'desc' ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/[0.03]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/40">
                    {CATS[product.category]} &middot; Tier: {product.cosmicTier}
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-white">
                    ${product.price}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1.5 text-xs font-medium text-white/60 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(product.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1.5 text-xs font-medium text-white/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Package className="mx-auto h-12 w-12 text-white/10" />
              <p className="mt-4 text-sm text-white/30">
                {search ? 'No products match your search.' : 'No products yet. Add your first one!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#050508]/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                  >
                    {Object.entries(CATS).map(([val, label]) => (
                      <option key={val} value={val} className="bg-black">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Cosmic Tier
                </label>
                <div className="flex gap-2">
                  {TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setForm({ ...form, cosmicTier: tier })}
                      className={`flex-1 rounded-xl border py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                        form.cosmicTier === tier
                          ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                          : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/[0.12]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Materials
                </label>
                <input
                  type="text"
                  value={form.materials}
                  onChange={(e) => setForm({ ...form, materials: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-purple-500/40"
                  placeholder="Materials used"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/50 uppercase tracking-wider">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-white/[0.06] bg-transparent"
                  />
                  <span className="text-xs text-white/40 font-mono">{form.accent}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Save className="mr-2 inline-block h-4 w-4" />
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#050508]/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400" />
            <h2 className="mb-2 text-center text-lg font-bold">Delete Product</h2>
            <p className="mb-6 text-center text-sm text-white/50">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-500"
              >
                <Trash2 className="mr-2 inline-block h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl transition-all ${
            toast.type === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : 'border-green-500/30 bg-green-500/10 text-green-300'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={16} />
          ) : (
            <Check size={16} />
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
