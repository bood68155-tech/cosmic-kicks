"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface SneakerSpecs {
  name: string;
  model: string;
  tier: string;
  material: string;
  weight: string;
  energyReturn: string;
  accent: [string, string];
}

const SNEAKERS: SneakerSpecs[] = [
  { name: "Nebula Runner NR-7", model: "NR-7X", tier: "Supernova", material: "Carbon-Celestial", weight: "187 g", energyReturn: "94%", accent: ["#8b5cf6", "#06b6d4"] },
  { name: "Void Walker VK-3", model: "VK-3S", tier: "Stellar", material: "Quantum-Mesh", weight: "203 g", energyReturn: "89%", accent: ["#ec4899", "#f97316"] },
  { name: "Quantum Prime QP-1", model: "QP-1L", tier: "Nebula", material: "Zero-G Foam", weight: "165 g", energyReturn: "97%", accent: ["#22d3ee", "#a78bfa"] },
  { name: "Astro Drift AD-9", model: "AD-9X", tier: "Supernova", material: "Nano-Weave", weight: "192 g", energyReturn: "91%", accent: ["#f59e0b", "#ef4444"] },
  { name: "Cosmic Surge CS-5", model: "CS-5P", tier: "Stellar", material: "Plasma-Knit", weight: "178 g", energyReturn: "93%", accent: ["#10b981", "#3b82f6"] },
];

function buildSneakerSVG(grad: string, c1: string, c2: string): string {
  return `<svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${grad}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="${c1}" stopOpacity="0.8"/>
        <stop offset="35%" stopColor="${c2}" stopOpacity="0.5"/>
        <stop offset="65%" stopColor="${c1}" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="${c1}" stopOpacity="0.3"/>
      </linearGradient>
      <filter id="g-${grad}"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <path d="M30 130 L38 124 L202 124 L210 130 L205 138 L34 138 Z" fill="url(#${grad})" opacity="0.85"/>
    <path d="M34 124 L42 82 L82 76 L72 92 L204 92 L208 124 Z" fill="url(#${grad})" opacity="0.7"/>
    <path d="M174 70 L208 70 L212 92 L72 92 L82 82 L164 82 Z" fill="url(#${grad})" opacity="0.55"/>
    <path d="M42 82 L56 42 L94 18 L174 42 L184 70 L164 82 L82 82 Z" fill="url(#${grad})" opacity="0.75" filter="url(#g-${grad})"/>
    <path d="M82 32 L110 40 L145 36 L174 42 L178 60 L82 60 Z" fill="url(#${grad})" opacity="0.45"/>
    <path d="M54 72 Q110 62 168 68 Q194 70 208 64" stroke="${c2}50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M36 82 L42 56 L48 46 L54 50" fill="url(#${grad})" opacity="0.35"/>
  </svg>`;
}

export default function InteractivePrism() {
  const prismRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const currentSpecs = SNEAKERS[activeIndex];
  const [c1, c2] = currentSpecs.accent;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!prismRef.current) return;
    const rect = prismRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetRef.current = { x: (x - 0.5) * 30, y: (0.5 - y) * 30 };
  }, []);

  const cycleSneaker = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SNEAKERS.length);
  }, []);

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;
      setRotateX(currentRef.current.y);
      setRotateY(currentRef.current.x);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Auto-rotate when not hovering
  useEffect(() => {
    if (isHovered) return;
    let autoAngle = 0;
    const interval = setInterval(() => {
      autoAngle += 0.02;
      if (!isHovered) {
        targetRef.current = {
          x: Math.sin(autoAngle) * 12,
          y: Math.cos(autoAngle * 0.7) * 12,
        };
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Prism Container with mouse tracking */}
      <div
        ref={prismRef}
        className="relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={cycleSneaker}
      >
        {/* Outer glow */}
        <div
          className="absolute -inset-20 rounded-full opacity-30 blur-[100px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${c1}40, ${c2}20, transparent 70%)`,
            transform: `translate(${currentRef.current.x * 0.5}px, ${currentRef.current.y * 0.5}px)`,
          }}
        />

        {/* Crystal Prism */}
        <div
          className="crystal-prism-3d relative"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="crystal-prism-3d__glow" />
          <div className="crystal-prism-3d__facets" />

          <div className="crystal-prism-3d__content">
            {/* Orbital rings */}
            <svg className="crystal-prism-3d__rings" viewBox="0 0 300 300" aria-hidden="true">
              <ellipse cx="150" cy="150" rx="140" ry="40" fill="none" stroke={`${c1}30`} strokeWidth="0.5" transform="rotate(-15 150 150)" />
              <ellipse cx="150" cy="150" rx="130" ry="35" fill="none" stroke={`${c2}25`} strokeWidth="0.5" transform="rotate(10 150 150)" />
              <ellipse cx="150" cy="150" rx="145" ry="30" fill="none" stroke={`${c1}20`} strokeWidth="0.3" transform="rotate(35 150 150)" />
            </svg>

            {/* Holographic sneaker display */}
            <div className="holographic-sneaker-3d">
              <div className="holographic-sneaker-3d__shimmer" />
              <div className="holographic-sneaker-3d__scanline" />
              <div
                className="holographic-sneaker-3d__image"
                dangerouslySetInnerHTML={{ __html: buildSneakerSVG(`prism-${activeIndex}`, c1, c2) }}
              />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "10%", left: "20%", animationDelay: "0s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "80%", left: "80%", animationDelay: "1.5s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "15%", left: "75%", animationDelay: "0.8s" }} />
            </div>
          </div>

          {/* Corner labels */}
          <span className="crystal-prism-3d__corner-label crystal-prism-3d__corner-label--tl" style={{ color: c1 }}>
            ▲ {currentSpecs.model}
          </span>
          <span className="crystal-prism-3d__corner-label crystal-prism-3d__corner-label--br">
            COSMIC KICKS
          </span>
        </div>
      </div>

      {/* Interactive hint */}
      <p className="mt-6 text-[10px] font-medium tracking-[0.2em] uppercase text-white/30 animate-pulse">
        Click to explore · Drag to rotate
      </p>
    </div>
  );
}