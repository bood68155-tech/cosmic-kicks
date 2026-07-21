'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function QtyStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-7 w-7 items-center justify-center text-white/40 transition-colors hover:text-white/80"
        aria-label="Decrease quantity"
      >
        <Minus size={12} />
      </button>
      <span className="min-w-[20px] text-center text-xs font-medium text-white/80 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center text-white/40 transition-colors hover:text-white/80"
        aria-label="Increase quantity"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function CartItemRow({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
  index,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  return (
    <div
      className="flex animate-fadeInUp items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 opacity-0 transition-all duration-300"
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Product image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-sm font-medium text-white/80">
            {product.name}
          </span>
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="shrink-0 text-white/20 transition-colors hover:text-red-400"
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
        <span className="text-xs text-white/40">
          ${product.price} each
        </span>
        <div className="mt-1 flex items-center justify-between">
          <QtyStepper
            value={quantity}
            onChange={(v) => onUpdateQuantity(product.id, v)}
          />
          <span className="text-sm font-semibold text-white/90 tabular-nums">
            ${(product.price * quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    subtotal,
    itemCount,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    },
    [closeCart],
  );

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus the drawer
      setTimeout(() => drawerRef.current?.focus(), 100);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      prevFocusRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-black/95 backdrop-blur-xl transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-white/60" />
            <h2 className="text-sm font-semibold text-white/90">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-white/50 tabular-nums">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/40 transition-colors hover:border-white/10 hover:text-white/80"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
                <ShoppingBag size={28} className="text-white/20" />
              </div>
              <p className="text-sm text-white/40">Your cart is empty</p>
              <p className="max-w-[200px] text-xs text-white/20">
                Looks like you haven&apos;t added any cosmic kicks yet.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white/80"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item, i) => (
                <CartItemRow
                  key={item.product.id}
                  product={{
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    category: item.product.category,
                  }}
                  quantity={item.quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.06] px-6 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="font-semibold text-white/90 tabular-nums">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <p className="mb-4 text-[11px] text-white/30">
              {subtotal >= 300
                ? 'Free shipping on this order!'
                : `Add ${((300 - subtotal).toLocaleString())} more for free shipping`}
            </p>
            <div className="mt-2">
              <PayPalScriptProvider options={{ clientId: 'sb', components: 'buttons', currency: 'USD' }}>
                <PayPalButtons
                  style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal' }}
                  createOrder={(_data: any, actions: any) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: subtotal.toFixed(2) },
                        description: 'Cosmic Kicks Order',
                      }],
                    });
                  }}
                  onApprove={(_data: any, actions: any) => {
                    return actions.order.capture().then(() => {
                      alert('Payment successful! Thank you for your order.');
                      clearCart();
                    });
                  }}
                  onError={() => {
                    alert('An error occurred during payment. Please try again.');
                  }}
                />
              </PayPalScriptProvider>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full text-center text-[11px] text-white/20 transition-colors hover:text-white/50"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}