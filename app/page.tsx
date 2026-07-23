import ProductCard from '@/app/components/ProductCard';
import NewsletterForm from '@/app/components/NewsletterForm';
import { products, categories } from '@/app/data/products';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-16 sm:pt-24">
      {/* ═══ Hero Showcase ═══ */}
      <section className="hero-cosmic relative mb-32">
        {/* Deep cosmic backdrop */}
        <div className="hero-cosmic__backdrop -mx-6 -mt-16 rounded-b-[3rem] sm:-mx-8 sm:-mt-24" />

        <div className="relative grid grid-cols-1 gap-12 pb-12 pt-8 lg:grid-cols-12 lg:gap-8">
          {/* ─── Left: Bold Typography ─── */}
          <div className="lg:col-span-5 lg:pr-8">
            {/* Collection badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cosmic-purple/50" />
              <span className="text-[11px] font-medium tracking-widest uppercase text-white/40">
                Summer Collection 2026
              </span>
            </div>

            {/* Bold heading */}
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

          {/* ─── Center: Crystal Prism + Holographic Sneaker ─── */}
          <div className="flex items-center justify-center lg:col-span-4">
            <div className="crystal-prism">
              <div className="crystal-prism__glow" />
              <div className="crystal-prism__facets" />
              <div className="crystal-prism__content">
                <div className="holographic-sneaker">
                  <div className="holographic-sneaker__ring" />
                  <div className="holographic-sneaker__inner">
                    <div className="holographic-sneaker__shimmer" />
                    <div className="holographic-sneaker__scanline" />
                    <svg
                      className="holographic-sneaker__image"
                      viewBox="0 0 200 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="holographic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                          <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#ec4899" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="holographic-glow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {/* Sole */}
                      <path d="M20 100 L30 95 L170 95 L180 100 L175 108 L25 108 Z" fill="url(#holographic-grad)" opacity="0.8" />
                      {/* Heel */}
                      <path d="M25 95 L30 60 L60 60 L55 70 L170 70 L175 95 Z" fill="url(#holographic-grad)" opacity="0.7" />
                      {/* Toe */}
                      <path d="M150 50 L175 50 L180 70 L55 70 L60 60 L140 60 Z" fill="url(#holographic-grad)" opacity="0.6" />
                      {/* Upper */}
                      <path d="M30 60 L40 30 L70 15 L140 30 L150 50 L140 60 L60 60 Z" fill="url(#holographic-grad)" opacity="0.75" filter="url(#holographic-glow)" />
                      {/* Lace area */}
                      <path d="M60 25 L80 30 L100 28 L120 32 L130 45 L60 45 Z" fill="url(#holographic-grad)" opacity="0.5" />
                      {/* Strip */}
                      <path d="M40 55 Q80 50 120 55 Q150 58 170 50" stroke="rgba(6,182,212,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
                      {/* Collar */}
                      <path d="M25 60 L30 45 L35 40 L40 42" fill="url(#holographic-grad)" opacity="0.4" />
                      {/* Heel counter */}
                      <path d="M30 70 L32 62 L36 58 L40 60" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="holographic-sneaker__corner-label">
                      ▲ HOLOGRAPHIC PREVIEW
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right: FIELD NOTE ID Sidebar ─── */}
          <div className="flex flex-col justify-center lg:col-span-3">
            <div className="field-note">
              <div className="field-note__header">
                <span className="field-note__badge">FIELD NOTE</span>
                <span className="field-note__title">// ID: NR-7X</span>
              </div>
              <div className="field-note__sep" />

              {/* Specs */}
              <div className="field-note__spec">
                <span className="field-note__spec-label">Project</span>
                <span className="field-note__spec-value field-note__spec-value--accent">COSMIC KICKS</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Model</span>
                <span className="field-note__spec-value">Nebula Runner NR-7</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Tier</span>
                <span className="field-note__spec-value field-note__spec-value--cyan">Supernova</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Material</span>
                <span className="field-note__spec-value">Carbon-Celestial</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Weight</span>
                <span className="field-note__spec-value">187 g</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Energy Return</span>
                <span className="field-note__spec-value field-note__spec-value--accent">94%</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Collection</span>
                <span className="field-note__spec-value">SS 2026</span>
              </div>
              <div className="field-note__spec">
                <span className="field-note__spec-label">Status</span>
                <span className="field-note__spec-value" style={{ color: 'rgba(34,197,94,0.6)' }}>
                  ● Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Carousel Pagination Dots ─── */}
        <div className="carousel-dots">
          <button className="carousel-dot carousel-dot--active" aria-label="Slide 1" />
          <button className="carousel-dot" aria-label="Slide 2" />
          <button className="carousel-dot" aria-label="Slide 3" />
          <button className="carousel-dot" aria-label="Slide 4" />
          <button className="carousel-dot" aria-label="Slide 5" />
        </div>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/[0.04] pt-8">
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
