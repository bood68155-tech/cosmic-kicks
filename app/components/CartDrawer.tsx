'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/app/context/CartContext';

/* ─── Quantity Stepper ─── */
function QtyStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center gap-0 overflow-hidden rounded-lg border border-white/[0.06]">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center text-xs text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        aria-label="Decrease quantity"
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span className="flex h-7 min-w-[2ch] items-center justify-center text-xs font-medium tabular-nums text-white/70">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center text-xs text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70"
        aria-label="Increase quantity"
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Cart Item Row ─── */
function CartItemRow({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
  index,
}: {
  product: { id: string; name: string; price: number; accent: string; svg: string };
  quantity: number;
  onUpdateQuantity: (q: number) => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div
      className="group flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:border-white/[0.08] animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      {/* Mini shoe */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.04] bg-white/[0.02] p-2">
        <div
          className="w-full text-white/20 transition-colors group-hover:text-white/30"
          dangerouslySetInnerHTML={{ __html: product.svg }}
        />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-white/80">{product.name}</p>
          <button
            onClick={onRemove}
            className="shrink-0 p-0.5 text-white/20 transition-colors hover:text-red-400"
            aria-label={`Remove ${product.name} from cart`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-white/40">${product.price}</p>
        <div className="mt-1 flex items-center justify-between">
          <QtyStepper value={quantity} onChange={onUpdateQuantity} />
          <p className="text-xs font-semibold tabular-nums text-white/60">
            ${(product.price * quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Drawer ─── */
export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  /* Trap focus & body scroll when open */
  useEffect(() => {
    if (!isOpen) return;

    prevFocusRef.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', handleKey);
      prevFocusRef.current?.focus();
    };
  }, [isOpen, closeCart]);

  /* Close on overlay click */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) closeCart();
    },
    [closeCart],
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-white/80">
              Cart
            </h2>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[11px] font-medium tabular-nums text-white/60">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/30 transition-all hover:border-white/[0.12] hover:text-white/60"
            aria-label="Close cart"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Body ─── */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <span className="text-3xl opacity-30">🛸</span>
            <p className="text-sm text-white/30">Your cart is floating in space</p>
            <button
              onClick={closeCart}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-medium text-white/40 transition-all hover:border-white/20 hover:text-white/60"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-2 overflow-y-auto px-6 py-4 scrollbar-thin">
              {items.map((item, idx) => (
                <CartItemRow
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onUpdateQuantity={(q) => updateQuantity(item.product.id, q)}
                  onRemove={() => removeItem(item.product.id)}
                  index={idx}
                />
              ))}
            </div>

            {/* ─── Footer / Totals ─── */}
            <div className="border-t border-white/[0.06] px-6 py-5">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span className="font-semibold tabular-nums text-white/80">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              {/* Shipping note */}
              <p className="mt-1 text-[11px] text-white/20">
                {subtotal >= 300
                  ? '✨ Free orbit shipping'
                  : `Add $${(300 - subtotal).toLocaleString()} more for free orbit shipping`}
              </p>

              {/* Checkout button */}
              <button
                onClick={() => {
                  /* Placeholder — wire to your payment gateway */
                  alert(
                    `Checkout — Total: $${subtotal.toLocaleString()}\n\nThis is a demo. Connect a payment provider to complete orders.`,
                  );
                }}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.13] hover:text-white"
              >
                Checkout
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-white/20 transition-colors hover:text-white/40"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
