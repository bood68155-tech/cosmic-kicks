'use client';

import { useCart } from '@/app/context/CartContext';

export default function CartIcon() {
  const { itemCount, openCart } = useCart();
  return (
    <button type="button" onClick={openCart} aria-label={`Shopping cart with ${itemCount} items`} className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-glass-bg text-text-secondary transition-all hover:border-glass-border-hover hover:bg-glass-bg-hover hover:text-text-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-cosmic-purple px-1 py-0.5 text-[10px] font-bold leading-none text-white shadow-lg">{itemCount > 99 ? '99+' : itemCount}</span>
      )}
    </button>
  );
}
