'use client';

import { useCart } from '@/app/context/CartContext';

export default function CartIcon() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open shopping cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/70"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Badge */}
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/15 px-1 text-[10px] font-bold tabular-nums text-white/90 ring-1 ring-black/50 transition-all">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
