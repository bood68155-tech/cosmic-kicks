'use client';

import { useState } from 'react';
import type { Product } from '@/app/data/products';
import { useCart } from '@/app/context/CartContext';

interface ProductCardProps {
  product: Product;
}

/* ─── Tier badge ─── */
function TierBadge({ tier }: { tier: Product['cosmicTier'] }) {
  const styles = {
    stellar: 'border-blue-900/30 bg-blue-950/20 text-blue-300/60',
    nebula: 'border-purple-900/30 bg-purple-950/20 text-purple-300/60',
    supernova: 'border-amber-900/30 bg-amber-950/20 text-amber-300/60',
  };

  const labels = {
    stellar: '✦ Stellar',
    nebula: '✦ Nebula',
    supernova: '✦ Supernova',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${styles[tier]}`}
    >
      {labels[tier]}
    </span>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05]"
    >
      {/* Glow effect on hover — uses product accent colors */}
      <div
        className={`pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${product.accent}15, transparent 40%)`,
        }}
      />

      {/* Image area */}
      <div className="relative flex items-center justify-center px-8 pt-10 pb-6">
        <div className="relative w-full max-w-[200px]">
          {/* Background glow — pulsing on hover */}
          <div
            className={`absolute inset-0 -top-4 -bottom-4 mx-auto w-3/4 rounded-full opacity-0 blur-3xl transition-all duration-700 ${
              isHovered ? 'opacity-20 scale-110' : 'opacity-5'
            }`}
            style={{ background: `radial-gradient(circle, ${product.accent2 || product.accent}, transparent)` }}
          />
          {/* SVG Shoe Silhouette */}
          <div
            className={`relative text-white/20 transition-all duration-700 ${
              isHovered ? 'scale-105 text-white/30' : ''
            }`}
            role="img"
            aria-label={`${product.name} shoe silhouette`}
            dangerouslySetInnerHTML={{ __html: product.svg }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-3 px-6 pb-6">
        {/* Header: name + price + tier */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-medium tracking-wide text-white/90">
              {product.name}
            </h3>
            <span className="text-sm font-semibold tabular-nums text-white/70">
              ${product.price}
            </span>
          </div>
          <TierBadge tier={product.cosmicTier} />
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-white/40 transition-colors duration-500 group-hover:text-white/50 line-clamp-2">
          {product.description}
        </p>

        {/* Details list (revealed on hover) */}
        <div
          className={`grid grid-cols-2 gap-x-3 gap-y-1 overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {product.details.slice(0, 4).map((detail) => (
            <span
              key={detail}
              className="flex items-center gap-1.5 text-[10px] leading-relaxed text-white/30"
            >
              <span
                className="inline-block h-1 w-1 rounded-full shrink-0"
                style={{ background: product.accent }}
              />
              {detail}
            </span>
          ))}
        </div>

        {/* Materials tag (always visible) */}
        <p className="text-[10px] leading-relaxed text-white/15 italic">
          {product.materials}
        </p>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={`relative mt-1 flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border text-sm font-medium transition-all duration-500 ${
            isHovered
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-white/[0.06] bg-white/[0.02] text-white/40'
          }`}
        >
          {/* Shine effect on hover */}
          <span
            className={`absolute inset-0 transition-transform duration-700 ${
              isHovered ? 'translate-x-full' : '-translate-x-full'
            }`}
            style={{
              background: `linear-gradient(90deg, transparent, ${product.accent}20, transparent)`,
            }}
          />
          <span className="relative z-10">Add to Cart</span>
          <svg
            className={`relative z-10 h-4 w-4 transition-transform duration-500 ${
              isHovered ? 'translate-x-0.5' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
