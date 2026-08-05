'use client';

import { useState } from 'react';
import type { Product } from '@/app/data/products';
import { useCart } from '@/app/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const TIER_CONFIG: Record<
  Product['cosmicTier'],
  { label: string; ring: string; text: string; bg: string; border: string }
> = {
  stellar: {
    label: 'Stellar',
    ring: 'ring-white/20',
    text: 'text-white/80',
    bg: 'bg-white/[0.06]',
    border: 'border-white/10',
  },
  nebula: {
    label: 'Nebula',
    ring: 'ring-purple-500/30',
    text: 'text-purple-300',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  supernova: {
    label: 'Supernova',
    ring: 'ring-amber-500/30',
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
};

/**
 * Keeps price text readable on solid dark cards by brightening
 * overly dark accent colors toward white.
 */
function readablePriceColor(accent: string): string {
  const hex = accent.replace('#', '');
  if (hex.length !== 6) return accent;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Clamp keeps already-bright accents unchanged while lifting dark ones.
  const t = Math.min(1, Math.max(0, (170 - luminance) / (255 - luminance)));
  const mix = (channel: number) => Math.round(channel + (255 - channel) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function TierBadge({ tier }: { tier: Product['cosmicTier'] }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${cfg.border} ${cfg.bg} px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${cfg.text} ring-1 ${cfg.ring}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            tier === 'supernova'
              ? 'bg-amber-400'
              : tier === 'nebula'
                ? 'bg-purple-400'
                : 'bg-white/50'
          }`}
        />
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            tier === 'supernova'
              ? 'bg-amber-400'
              : tier === 'nebula'
                ? 'bg-purple-400'
                : 'bg-white/70'
          }`}
        />
      </span>
      {cfg.label}
    </span>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-space-mid p-6 transition-all duration-500 ${
        isHovered
          ? 'border-white/[0.2] bg-space-light shadow-2xl translate-y-[-2px]'
          : 'hover:border-white/[0.14]'
      }`}
    >
      {/* Glow effect on hover */}
      <div
        className={`pointer-events-none absolute -inset-12 opacity-0 transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: `radial-gradient(600px circle at 50% 0%, ${product.accent}15 0%, transparent 70%)`,
        }}
      />

      {/* Product image */}
      <div className="relative mb-4 flex items-center justify-center">
        {/* Placeholder/shimmer */}
        {!imageLoaded && !imageError && (
          <div className="aspect-square w-full max-w-[260px] animate-pulse rounded-xl bg-white/[0.03]" />
        )}
        
        {imageError ? (
          <div className="flex aspect-square w-full max-w-[260px] items-center justify-center rounded-xl bg-white/[0.03]">
            <span className="text-5xl opacity-30">
              {product.category === 'sneakers' ? '👟' : product.category === 'boots' ? '👢' : '👞'}
            </span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full max-w-[260px] aspect-square rounded-xl object-contain transition-all duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Tier badge */}
        <div className="absolute right-2 top-2">
          <TierBadge tier={product.cosmicTier} />
        </div>
      </div>

      {/* Product info */}
      <div className="relative">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-white">
            {product.name}
          </h3>
          <span
            className="shrink-0 text-sm font-bold tabular-nums"
            style={{ color: readablePriceColor(product.accent) }}
          >
            ${product.price}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/70">
          {product.description}
        </p>

        {/* Details revealed on hover */}
        <div
          className={`mb-4 space-y-1 overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {product.details.slice(0, 4).map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-white/70">
              <span
                className="mt-0.5 block h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: product.accent }}
              />
              {detail}
            </div>
          ))}
          <div className="pt-2 text-[10px] italic text-white/60">
            {product.materials}
          </div>
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`relative w-full overflow-hidden rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
            isHovered
              ? 'border-white/20 bg-white/[0.08] text-white shadow-lg'
              : 'border-white/[0.06] bg-white/[0.03] text-white/60 hover:border-white/10 hover:bg-white/[0.05] hover:text-white/80'
          }`}
        >
          {/* Shine effect on hover */}
          <span
            className={`pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 ${
              isHovered ? 'translate-x-full' : ''
            }`}
          />
          <span className="relative z-10">Add to Cart</span>
        </button>
      </div>
    </article>
  );
}
