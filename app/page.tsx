import ProductCard from '@/app/components/ProductCard';
import NewsletterForm from '@/app/components/NewsletterForm';
import { products, categories } from '@/app/data/products';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-16 sm:pt-24">
      {/* ═══ Hero Section ═══ */}
      <section className="relative mb-32">
        {/* Floating celestial decorations */}
        <div className="pointer-events-none absolute select-none" aria-hidden="true">
          {/* Orbital ring system */}
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] opacity-[0.02] sm:h-[600px] sm:w-[600px]">
            <svg viewBox="0 0 600 600" fill="none">
              <circle cx="300" cy="300" r="250" stroke="white" strokeWidth="0.4" opacity="0.3" />
              <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="0.3" opacity="0.15" />
              <ellipse cx="300" cy="300" rx="250" ry="80" stroke="white" strokeWidth="0.35" opacity="0.1" transform="rotate(-25, 300, 300)" />
              <ellipse cx="300" cy="300" rx="180" ry="60" stroke="white" strokeWidth="0.25" opacity="0.08" transform="rotate(15, 300, 300)" />
              {/* Orbiting particles */}
              <circle cx="300" cy="50" r="3" fill="white" opacity="0.3" />
              <circle cx="520" cy="160" r="2" fill="white" opacity="0.2" />
              <circle cx="80" cy="380" r="2.5" fill="white" opacity="0.25" />
              <circle cx="440" cy="480" r="1.5" fill="white" opacity="0.15" />
              <circle cx="180" cy="120" r="2" fill="white" opacity="0.2" />
              {/* Distant specks */}
              <circle cx="350" cy="80" r="1" fill="white" opacity="0.1" />
              <circle cx="500" cy="280" r="1" fill="white" opacity="0.12" />
            </svg>
          </div>

          {/* Decorative mini planets */}
          <div className="absolute right-8 top-12 h-12 w-12 rounded-full opacity-[0.04] sm:right-16 sm:h-20 sm:w-20"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #e8d8b0, #a08860 50%, #705840 100%)',
              boxShadow: '0 0 40px rgba(200, 180, 120, 0.06)',
            }}
          />
          <div className="absolute right-4 top-20 h-24 w-24 rounded-full opacity-[0.03] sm:right-8 sm:h-32 sm:w-32"
            style={{
              background: 'radial-gradient(circle at 40% 30%, rgba(80, 180, 220, 0.2), rgba(30, 60, 120, 0.15) 50%, transparent 100%)',
              filter: 'blur(4px)',
            }}
          />
        </div>

        <div className="relative max-w-2xl">
          {/* Label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/40" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/40">
              Summer Collection 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-light leading-[1.1] tracking-tight text-white/90 sm:text-6xl lg:text-7xl">
            Step Beyond{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-white/90 via-white/70 to-white/40 bg-clip-text text-transparent">
                the Horizon
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
            Premium footwear forged for the cosmos. Each pair is engineered at the
            intersection of earthly craftsmanship and celestial ambition.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#sneakers"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.13] hover:text-white"
            >
              Explore Collection
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="#boots"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 text-sm font-medium text-white/40 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:text-white/60"
            >
              New Arrivals
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap gap-x-12 gap-y-4">
          {[
            { label: 'Collections', value: '3' },
            { label: 'Styles', value: `${products.length}` },
            { label: 'Materials', value: 'Carbon-Celestial' },
            { label: 'Delivery', value: 'Free Orbit' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs font-medium tracking-widest uppercase text-white/40">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-light text-white/60">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Product Sections ═══ */}
      {categories.map((category, categoryIndex) => {
        const categoryProducts = products.filter(
          (p) => p.category === category.id
        );

        return (
          <section
            key={category.id}
            id={category.id}
            className="mb-28 scroll-mt-28"
          >
            {/* Section header */}
            <div
              className="mb-12 animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 0.15}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl font-light tracking-tight text-white/80 sm:text-3xl">
                  {category.name}
                </h2>
              </div>
              <p className="mt-2 text-sm font-medium tracking-wide text-white/40">
                {category.tagline}
              </p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/45">
                {category.description}
              </p>
              <p className="mt-2 text-xs text-white/40">
                {categoryProducts.length} styles available
              </p>
            </div>

            {/* Product grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ═══ CTA Banner ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-8 py-16 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/[0.02] blur-3xl" />
          {/* Decorative dots */}
          <div className="absolute left-1/4 top-1/3 h-1 w-1 rounded-full bg-white/5" />
          <div className="absolute right-1/3 bottom-1/4 h-1.5 w-1.5 rounded-full bg-white/5" />
          <div className="absolute left-1/2 bottom-1/3 h-0.5 w-0.5 rounded-full bg-white/8" />
        </div>

        <div className="relative">
          <span className="text-3xl">🌌</span>
          <h2 className="mt-4 text-2xl font-light text-white/70 sm:text-3xl">
            Ready for lift-off?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
            Join the Cosmic Kicks community and be the first to know about
            limited drops, celestial collaborations, and interstellar restocks.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
