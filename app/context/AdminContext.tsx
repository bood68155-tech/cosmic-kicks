'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { Product } from '@/app/data/products';
import { products as initialProducts } from '@/app/data/products';

const STORAGE_KEY = 'cosmic-kicks-products';

interface AdminContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  productCount: number;
  lastUpdated: number | null;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function loadFromStorage(): Product[] {
  if (typeof window === 'undefined') return initialProducts;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Product[];
    }
  } catch {
    // If parse fails, return initial
  }
  return initialProducts;
}

function saveToStorage(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (!initialized) {
      setProducts(loadFromStorage());
      setInitialized(true);
    }
  }, [initialized]);

  // Persist to localStorage when products change
  useEffect(() => {
    if (initialized) {
      saveToStorage(products);
    }
  }, [products, initialized]);

  const addProduct = useCallback((product: Product) => {
    const newProduct = {
      ...product,
      id: product.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setProducts((prev) => [...prev, newProduct]);
    setLastUpdated(Date.now());
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
    setLastUpdated(Date.now());
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLastUpdated(Date.now());
  }, []);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  const productCount = useMemo(() => products.length, [products]);

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      productCount,
      lastUpdated,
    }),
    [
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      productCount,
      lastUpdated,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
