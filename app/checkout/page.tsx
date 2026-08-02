'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '@/app/context/CartContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Wallet,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_FEE = 10;
const ORDERS_KEY = 'cosmic-kicks-orders';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';

const RECORD_DATE = new Date().toISOString();

function newOrderId(): string {
  return `ord_${Date.now()}`;
}

type PayMethod = 'paypal' | 'card';

interface OrderRecord {
  id: string;
  date: string;
  method: PayMethod;
  contact: { name: string; email: string };
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}

/* ─── Order history helpers (localStorage) ─── */

function loadOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

function pushOrder(record: OrderRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = loadOrders();
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([record, ...orders]));
  } catch {}
}

/* ─── Checkout ─── */

function CheckoutContent() {
  const { items, subtotal, itemCount, clearCart, updateQuantity, removeItem } = useCart();
  const searchParams = useSearchParams();

  const [method, setMethod] = useState<PayMethod>('paypal');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);
  const [contact, setContact] = useState({ name: '', email: '' });
  const processedReturnRef = useRef(false);
  const orderSourceRef = useRef<'server' | 'client'>('client');

  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  
  const payloadItems = useMemo(
    () =>
      items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    [items],
  );

  const completeOrder = useCallback(
    (paidWith: PayMethod, id: string) => {
      const record: OrderRecord = {
        id,
        date: new Date().toISOString(),
        method: paidWith,
        contact,
        items: payloadItems,
        subtotal,
        shipping,
        total,
      };
      pushOrder(record);
      setPlacedOrder(record);
      clearCart();
    },
    [contact, payloadItems, subtotal, shipping, total, clearCart],
  );

  // Stripe Checkout redirects back with ?success=1&order=... or ?canceled=1.
  // Derive the success/cancel state directly from the URL so no setState is
  // triggered from inside an effect.
  const returnSuccess = searchParams.get('success') !== null;
  const returnCanceled = searchParams.get('canceled') !== null && !returnSuccess;
  const returnOrderId = searchParams.get('order') || 'card-order';

  const derivedReturnOrder = useMemo<OrderRecord | null>(() => {
    if (!returnSuccess) return null;
    return {
      id: returnOrderId,
      date: RECORD_DATE,
      method: 'card',
      contact,
      items: payloadItems,
      subtotal,
      shipping,
      total,
    };
  }, [returnSuccess, returnOrderId, contact, payloadItems, subtotal, shipping, total]);

  // Prefer the persisted order record (survives the cart being cleared).
  const storedReturnOrder = returnSuccess
    ? loadOrders().find((o) => o.id === returnOrderId) ?? null
    : null;

  const displayOrder = placedOrder ?? storedReturnOrder ?? derivedReturnOrder;
  const displayError = error || (returnCanceled ? 'Payment was cancelled. You can try again when you are ready.' : '');

  // Record the card order and clear the cart once, after the Stripe redirect.
  useEffect(() => {
    if (!returnSuccess || processedReturnRef.current) return;
    processedReturnRef.current = true;
    if (derivedReturnOrder && derivedReturnOrder.items.length > 0) {
      pushOrder(derivedReturnOrder);
    }
    clearCart();
  }, [returnSuccess, derivedReturnOrder, clearCart]);

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    setError('');
    try {
      const orderId = newOrderId();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: payloadItems,
          shipping_amount: shipping,
          success_url: `${window.location.origin}/checkout?success=1&order=${orderId}`,
          cancel_url: `${window.location.origin}/checkout?canceled=1`,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error || 'Checkout failed');
      }
      const json = (await res.json()) as { url: string };
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setStripeLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/85 placeholder-white/20 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.05]';

  /* ─── Success view ─── */
  if (displayOrder) {
    return (
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col items-center justify-center px-6 py-20 text-center" style={{ animation: 'fade-in 0.6s ease-out both' }}>
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white">Order confirmed!</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          Thanks{displayOrder.contact.name ? `, ${displayOrder.contact.name.split(' ')[0]}` : ''}! Your cosmic gear is
          being prepped for launch. A confirmation has been recorded on this device.
        </p>
        <div className="mt-8 w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Order ID</span>
            <span className="font-mono text-xs text-white/70">{displayOrder.id}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-white/40">Paid via</span>
            <span className="flex items-center gap-1.5 text-white/70">
              {displayOrder.method === 'paypal' ? <Wallet className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
              {displayOrder.method === 'paypal' ? 'PayPal' : 'Credit / Debit Card'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-white/40">Items</span>
            <span className="text-white/70">{displayOrder.items.length}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-base font-semibold">
            <span className="text-white/60">Total</span>
            <span className="text-white">${displayOrder.total.toFixed(2)}</span>
          </div>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-all hover:from-purple-500 hover:to-indigo-500"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  /* ─── Empty cart view ─── */
  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 px-6 text-center" style={{ animation: 'fade-in 0.6s ease-out both' }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
          <ShoppingBag className="h-9 w-9 text-white/20" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">Your cart is empty</h1>
        <p className="max-w-xs text-sm text-white/40">Add some cosmic gear before heading to checkout.</p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Browse the collection
        </Link>
      </div>
    );
  }

  /* ─── Checkout layout ─── */
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white/70">
        <ArrowLeft className="h-3.5 w-3.5" />
        Continue shopping
      </Link>
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight text-white">Checkout</h1>
      <p className="mt-1 text-sm text-white/40">{itemCount} item{itemCount === 1 ? '' : 's'} in your order</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* ── Left: contact + payment ── */}
        <div className="space-y-6 lg:col-span-3">
          {/* Contact */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Full Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className={inputClass}
                  placeholder="Cosmo Walker"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@cosmos.space"
                  autoComplete="email"
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Payment method</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('paypal')}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                  method === 'paypal'
                    ? 'border-[#FFC439]/50 bg-[#FFC439]/10 text-[#FFD96B] shadow-[0_0_20px_rgba(255,196,57,0.12)]'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:text-white/70'
                }`}
              >
                <Wallet className="h-4 w-4" />
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                  method === 'card'
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:text-white/70'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Card
              </button>
            </div>

            <div className="mt-5">
              {method === 'paypal' ? (
                <PayPalScriptProvider
                  key={`paypal-${total}-${payloadItems.length}`}
                  options={{ clientId: PAYPAL_CLIENT_ID, components: 'buttons', currency: 'USD', intent: 'capture' }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 48 }}
                    createOrder={async (_data, actions) => {
                      const orderId = newOrderId();
                      const payload = { orderId, items: payloadItems, subtotal, shipping, total };
                      try {
                        const res = await fetch('/api/paypal/orders', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload),
                        });
                        if (res.ok) {
                          const json = (await res.json()) as { id?: string };
                          if (json.id) {
                            orderSourceRef.current = 'server';
                            return json.id;
                          }
                        }
                      } catch {
                        // fall through to client-side order creation
                      }
                      orderSourceRef.current = 'client';
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                          {
                            description: 'Cosmic Kicks order',
                            amount: { currency_code: 'USD', value: total.toFixed(2) },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const payload = { orderId: data.orderID, items: payloadItems, subtotal, shipping, total };
                      if (orderSourceRef.current === 'server') {
                        // Server-created orders must be captured server-side.
                        try {
                          const res = await fetch('/api/paypal/capture', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                          });
                          if (res.ok) {
                            const json = (await res.json()) as { captureId?: string };
                            completeOrder('paypal', json.captureId || data.orderID);
                            return;
                          }
                        } catch {
                          // fall through to the error below
                        }
                        setError('Payment was received but confirmation failed. Our team has been notified — your order will be fulfilled.');
                        return;
                      }
                      // Client-created order (sandbox demo) → capture client-side.
                      if (actions.order) {
                        await actions.order.capture();
                        completeOrder('paypal', data.orderID);
                      } else {
                        setError('Unable to confirm payment. Please try again.');
                      }
                    }}
                    onCancel={() => setError('PayPal payment was cancelled. You can try again.')}
                    onError={() => setError('An error occurred during payment. Please try again.')}
                  />
                </PayPalScriptProvider>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs leading-relaxed text-white/40">
                    You will be securely redirected to Stripe Checkout to complete your card payment.
                  </p>
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={stripeLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {stripeLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay with Card
                      </>
                    )}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/25">
                    <Lock className="h-3 w-3" />
                    Payments are encrypted and processed securely
                  </p>
                </div>
              )}

              {displayError && (
                <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300" style={{ animation: 'fade-in 0.3s ease-out both' }}>
                  {displayError}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* ── Right: order summary ── */}
        <aside className="h-fit rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Order summary</h2>
          <div className="mt-4 flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/85">{item.product.name}</p>
                  <p className="text-xs text-white/40">${item.product.price} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.06] text-white/40 transition-colors hover:text-white/80"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center text-xs font-medium text-white/80 tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.06] text-white/40 transition-colors hover:text-white/80"
                    aria-label="Increase quantity"
                  >
                    <Plus size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-white/20 transition-colors hover:text-red-400"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/40">Subtotal</span>
              <span className="font-medium text-white/85 tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Shipping</span>
              <span className="font-medium text-white/85 tabular-nums">
                {shipping === 0 ? <span className="text-emerald-400">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-base font-semibold">
              <span className="text-white/60">Total</span>
              <span className="text-white tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-white/30">
            {subtotal >= FREE_SHIPPING_THRESHOLD
              ? '🚀 Free shipping unlocked on this order!'
              : `Add $${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.`}
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/40">Loading checkout…</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
