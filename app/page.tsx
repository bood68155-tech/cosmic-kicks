"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from '@/app/components/ProductCard';
import NewsletterForm from '@/app/components/NewsletterForm';
import InteractivePrism from '@/app/components/InteractivePrism';
import ParticleField from '@/app/components/ParticleField';
import { products, categories } from '@/app/data/products';

const PRODUCT_CATEGORIES = [
  { id: "origins", overline: "Chapter I", name: "Origins", accent: "rgba(139,92,246,1)", description: "Where it all began. Foundational designs rooted in celestial ambition — forged from the core of dying stars to carry you through the cosmos." },
  { id: "agility", overline: "Chapter II", name: "Agility", accent: "rgba(6,182,212,1)", description: "Engineered for speed. Quantum-woven uppers and zero-gravity soles that respond to your every move." },
  { id: "velocity", overline: "Chapter III", name: "Velocity", accent: "rgba(236,72,153,1)", description: "The apex of performance. Cutting-edge propulsion meets interstellar design — built for those who refuse to be bound by gravity." },
];

const CAROUSEL_SLIDES = [
  { label: "Nebula Runner", color: "#8b5cf6" },
  { label: "Void Walker", color: "#ec4899" },
  { label: "Quantum Prime", color: "#22d3ee" },
  { label: "Astro Drift", color: "#f59e0b" },
  { label: "Cosmic Surge", color: "#10b981" },
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

        {/* ════════════════════════════════════════════
            SECTION 1: HERO — Full-Screen Immersive
            ════════════════════════════════════════════ */}
        <section className="hero-immersive">
          <div className="hero-immersive__grid">
            {/* Left: Brand Typography */}
            <div className="hero-immersive__brand animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              <div className="hero-immersive__badge">
                <span className="hero-immersive__badge-dot" />
                <span className="hero-immersive__badge-text">Summer Collection 2026</span>
              </div>
              <div className="hero-immersive__logo">
                <span className="hero-immersive__logo-top">Cosmic Kicks</span>
                <h1 className="hero-immersive__title">
                  Step Beyond{' '}
                  <span className="hero-immersive__title-accent">the Horizon</span>
                </h1>
              </div>
              <p className="hero-immersive__subtitle">
                Premium footwear forged for the cosmos. Each pair is engineered at the
                intersection of earthly craftsmanship and celestial ambition.
              </p>
              <div className="hero-immersive__ctas">
                <a href="#origins" className="hero-immersive__btn hero-immersive__btn--primary">
                  Explore Collection
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a href="#velocity" className="hero-immersive__btn hero-immersive__btn--secondary">
                  New Arrivals
                </a>
              </div>
            </div>

            {/* Center: 3D Interactive Crystal Prism */}
            <div className="flex items-center justify-center" style={{ animation: "fade-in 0.6s ease-out 0.6s both" }}>
              <InteractivePrism />
            </div>

            {/* Right: FIELD NOTE Specs Sidebar */}
            <div className="hidden lg:flex flex-col justify-center" style={{ animation: "fade-in 0.6s ease-out 0.9s both" }}>
              <div className="field-note">
                <div className="field-note__header">
                  <span className="field-note__badge">FIELD NOTE</span>
                  <span className="field-note__title">// ID: NR-7X</span>
                </div>
                <div className="field-note__sep" />
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
                  <span className="field-note__spec-value" style={{ color: "rgba(34,197,94,0.6)" }}>
                    ● Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="carousel-dots">
            {CAROUSEL_SLIDES.map((slide, i) => (
              <button
                key={slide.label}
                className={`carousel-dot ${i === activeSlide ? "carousel-dot--active" : ""}`}
                aria-label={slide.label}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>

          {/* Stats Row */}
          <div className="stats-bar" style={{ maxWidth: "1280px", margin: "2rem auto 0", padding: "2rem 2rem 0" }}>
            {[
              { label: "Collections", value: "3" },
              { label: "Styles", value: `${products.length}` },
              { label: "Materials", value: "Carbon-Celestial" },
              { label: "Delivery", value: "Free Orbit" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="stats-bar__label">{stat.label}</p>
                <p className="stats-bar__value">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <div className="scroll-indicator__mouse">
              <div className="scroll-indicator__wheel" />
            </div>
            <span className="scroll-indicator__text">Scroll</span>
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
            SECTION 5: CTA BANNER
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