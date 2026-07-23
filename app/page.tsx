"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from '@/app/components/ProductCard';
import NewsletterForm from '@/app/components/NewsletterForm';
import InteractivePrism from '@/app/components/InteractivePrism';
import ParticleField from '@/app/components/ParticleField';
import { products } from '@/app/data/products';

const PRODUCT_CATEGORIES = [
  { id: "origins", overline: "Chapter I", name: "Origins", accent: "rgba(139,92,246,1)", description: "Where it all began. Foundational designs rooted in celestial ambition — forged from the core of dying stars to carry you through the cosmos." },
  { id: "agility", overline: "Chapter II", name: "Agility", accent: "rgba(6,182,212,1)", description: "Engineered for speed. Quantum-woven uppers and zero-gravity soles that respond to your every move." },
  { id: "velocity", overline: "Chapter III", name: "Velocity", accent: "rgba(236,72,153,1)", description: "The apex of performance. Cutting-edge propulsion meets interstellar design — built for those who refuse to be bound by gravity." },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observeSection = useCallback((id: string, el: HTMLElement | null) => {
    if (!el) return;
    sectionRefs.current[id] = el;
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );
    }
    observerRef.current.observe(el);
  }, []);

  useEffect(() => {
    return () => { observerRef.current?.disconnect(); };
  }, []);

  return (
    <>
      {/* ═══════ DYNAMIC NEBULA PARTICLE FIELD ═══════ */}
      <ParticleField />

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="relative z-10">

        {/* ═══════════════════════════════════════════════════
            HORIZON HERO — Full-Screen Centered Cinematic
            Deep Space · Mountains · Red/Orange Glow
            ═══════════════════════════════════════════════════ */}
        <section className="horizon-hero">

          {/* ── Starry backdrop (CSS specks) ── */}
          <div className="horizon-hero__stars" />

          {/* ── Ambient red/orange glow ── */}
          <div className="horizon-hero__glow--secondary" />
          <div className="horizon-hero__glow" />

          {/* ── Centered content stack ── */}
          <div className="horizon-hero__content">
            {/* Collection badge */}
            <div className="horizon-hero__badge">
              <span className="horizon-hero__badge-dot" />
              <span className="horizon-hero__badge-text">Summer Collection 2026</span>
            </div>

            {/* Massive centered title */}
            <h1 className="horizon-hero__title" data-text="COSMIC KICKS">
              <span className="horizon-hero__title-glow">COSMIC KICKS</span>
            </h1>

            {/* Subtitle */}
            <p className="horizon-hero__subtitle">
              Step beyond the horizon with advanced cosmic footwear — engineered at the
              intersection of earthly craftsmanship and celestial ambition.
            </p>

            {/* CTAs */}
            <div className="horizon-hero__ctas">
              <a href="#origins" className="horizon-hero__btn horizon-hero__btn--primary">
                Explore Collection
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a href="#velocity" className="horizon-hero__btn horizon-hero__btn--secondary">
                New Arrivals
              </a>
            </div>

            {/* Crystal Prism (below content) */}
            <div className="horizon-hero__prism">
              <InteractivePrism />
            </div>
          </div>

          {/* ── Mountain silhouette SVGs at the bottom ── */}
          <div className="horizon-hero__mountains">
            <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Deep background mountains */}
              <path
                d="M0 400 L0 280 Q100 240 180 260 Q260 280 340 220 Q420 160 500 200 Q580 240 620 180 Q660 120 720 170 Q780 220 840 160 Q900 100 960 150 Q1020 200 1080 140 Q1140 80 1200 130 Q1260 180 1320 220 Q1380 260 1440 240 L1440 400 Z"
                fill="rgba(10,10,24,0.5)"
              />
              {/* Mid mountains */}
              <path
                d="M0 400 L0 310 Q80 280 160 300 Q240 320 320 270 Q400 220 480 260 Q560 300 640 240 Q720 180 800 230 Q880 280 960 210 Q1040 140 1120 200 Q1200 260 1280 230 Q1360 200 1440 260 L1440 400 Z"
                fill="rgba(8,8,20,0.6)"
              />
              {/* Foreground mountains (darkest) */}
              <path
                d="M0 400 L0 340 Q60 320 120 340 Q180 360 240 320 Q300 280 360 310 Q420 340 480 300 Q540 260 600 290 Q660 320 720 280 Q780 240 840 290 Q900 340 960 300 Q1020 260 1080 310 Q1140 360 1200 330 Q1260 300 1320 340 Q1380 380 1440 350 L1440 400 Z"
                fill="rgba(5,5,8,0.8)"
              />
              {/* Horizon glow line */}
              <path
                d="M0 400 L0 345 Q360 330 720 340 Q1080 350 1440 340"
                stroke="rgba(255,120,40,0.08)"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>
          </div>

          {/* ── Minimalist scroll indicator ── */}
          <div className="horizon-hero__scroll">
            <div className="horizon-hero__scroll-line" />
            <span className="horizon-hero__scroll-text">Explore</span>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 2-4: VERTICAL PRODUCT SHOWCASE
            Origins · Agility · Velocity
            ════════════════════════════════════════════ */}
        <div className="product-showcase">
          {PRODUCT_CATEGORIES.map((section, sectionIdx) => {
            const catId = sectionIdx === 0 ? "sneakers" : sectionIdx === 1 ? "classic" : "boots";
            const catProducts = products.filter((p) => p.category === catId);

            return (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => observeSection(section.id, el)}
                className={`product-showcase__section product-showcase__section--${section.id}`}
              >
                <div className="product-showcase__inner">
                  {/* Section Number */}
                  <div className="product-showcase__number">
                    {String(sectionIdx + 1).padStart(2, "0")}
                  </div>

                  {/* Section Header (animates in on scroll) */}
                  <div
                    className="product-showcase__header"
                    style={{
                      opacity: visibleSections[section.id] ? 1 : 0,
                      transform: visibleSections[section.id] ? "translateY(0)" : "translateY(30px)",
                      transition: "all 0.8s ease-out",
                      transitionDelay: "0.1s",
                    }}
                  >
                    <span className={`product-showcase__overline product-showcase__overline--${section.id}`}>
                      {section.overline}
                    </span>
                    <h2 className="product-showcase__title">
                      <span className="product-showcase__title-gradient">{section.name}</span>
                    </h2>
                    <p className="product-showcase__desc">{section.description}</p>
                  </div>

                  {/* Product Grid with staggered reveal */}
                  <div className="product-showcase__grid">
                    {catProducts.map((product, productIdx) => {
                      const gradId = `showcase-grad-${product.id}`;
                      return (
                        <div
                          key={product.id}
                          className={`showcase-card ${visibleSections[section.id] ? "showcase-card--visible" : ""}`}
                          style={{
                            transitionDelay: `${0.2 + productIdx * 0.1}s`,
                            transitionDuration: "0.6s",
                            transitionProperty: "opacity, transform",
                            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {/* Glow effect on hover */}
                          <div
                            className="showcase-card__glow"
                            style={{
                              background: `radial-gradient(circle, ${section.accent}15, transparent 60%)`,
                            }}
                          />
                          {/* Sneaker SVG */}
                          <div className="showcase-card__image">
                            <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={product.accent[0]} stopOpacity="0.6" />
                                  <stop offset="50%" stopColor={product.accent[1]} stopOpacity="0.4" />
                                  <stop offset="100%" stopColor={product.accent[0]} stopOpacity="0.3" />
                                </linearGradient>
                              </defs>
                              <path d="M30 130 L38 124 L202 124 L210 130 L205 138 L34 138 Z" fill={`url(#${gradId})`} opacity="0.8" />
                              <path d="M34 124 L42 82 L82 76 L72 92 L204 92 L208 124 Z" fill={`url(#${gradId})`} opacity="0.7" />
                              <path d="M174 70 L208 70 L212 92 L72 92 L82 82 L164 82 Z" fill={`url(#${gradId})`} opacity="0.55" />
                              <path d="M42 82 L56 42 L94 18 L174 42 L184 70 L164 82 L82 82 Z" fill={`url(#${gradId})`} opacity="0.75" />
                              <path d="M54 72 Q110 62 168 68 Q194 70 208 64" stroke={`${product.accent[0]}50`} strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                          </div>
                          {/* Product Info */}
                          <div className="showcase-card__info">
                            <h3 className="showcase-card__name">{product.name}</h3>
                            <div className="showcase-card__meta">
                              <span className="showcase-card__price">${product.price}</span>
                              <span
                                className="showcase-card__tier"
                                style={{ borderColor: `${product.accent[0]}30`, color: product.accent[0] }}
                              >
                                {product.cosmicTier}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════
            CTA BANNER
            ════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-8 py-16 text-center"
          style={{ margin: "0 auto 8rem", maxWidth: "1280px", padding: "4rem 2rem" }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/[0.02] blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/[0.02] blur-3xl" />
            <div className="absolute left-1/4 top-1/3 h-1 w-1 rounded-full bg-white/5" />
            <div className="absolute right-1/3 bottom-1/4 h-1.5 w-1.5 rounded-full bg-white/5" />
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
    </>
  );
}
