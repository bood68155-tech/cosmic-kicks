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

/**
 * Builds a detailed holographic sneaker SVG with clear outlines,
 * metallic gradients, distinct shoe contours, and glowing accents.
 */
function buildSneakerSVG(grad: string, c1: string, c2: string): string {
  const holoId = `holo-${grad}`;
  const glowId = `glow-${grad}`;
  const metalId = `metal-${grad}`;
  const outlineId = `outline-${grad}`;

  return `<svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Main holographic gradient -->
      <linearGradient id="${holoId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="${c1}" stopOpacity="0.85"/>
        <stop offset="25%" stopColor="${c2}" stopOpacity="0.6"/>
        <stop offset="50%" stopColor="${c1}" stopOpacity="0.7"/>
        <stop offset="75%" stopColor="${c2}" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="${c1}" stopOpacity="0.6"/>
      </linearGradient>

      <!-- Metallic midsole gradient -->
      <linearGradient id="${metalId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="${c1}" stopOpacity="0.9"/>
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="${c2}" stopOpacity="0.8"/>
      </linearGradient>

      <!-- Outline glow -->
      <filter id="${glowId}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Soft glow for accents -->
      <filter id="${outlineId}">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Holographic shimmer filter -->
      <filter id="holo-sheen">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
        <feColorMatrix type="hueRotate" values="0" in="noise" result="hue"/>
        <feComposite in="hue" in2="SourceGraphic" operator="in" result="sheen"/>
        <feBlend in="sheen" in2="SourceGraphic" mode="screen"/>
      </filter>
    </defs>

    <!-- ====== OUTSOLE / TREAD ====== -->
    <path d="M22 130 L30 122 L208 122 L216 130 L212 138 L26 138 Z"
      fill="${c1}" opacity="0.3" stroke="${c2}" strokeWidth="1" strokeOpacity="0.5"/>

    <!-- Tread pattern lines -->
    <line x1="40" y1="138" x2="45" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="60" y1="138" x2="65" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="80" y1="138" x2="85" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="100" y1="138" x2="105" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="120" y1="138" x2="125" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="140" y1="138" x2="145" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="160" y1="138" x2="165" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>
    <line x1="180" y1="138" x2="185" y2="130" stroke="${c2}" strokeWidth="0.8" strokeOpacity="0.4"/>

    <!-- ====== MIDSOLE (metallic) ====== -->
    <path d="M24 130 L32 120 L206 120 L214 130 L208 134 L28 134 Z"
      fill="url(#${metalId})" opacity="0.75" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3"/>

    <!-- Midsole air bubble detail -->
    <ellipse cx="170" cy="127" rx="12" ry="4" fill="none" stroke="${c2}" strokeWidth="0.6" strokeOpacity="0.5"/>
    <ellipse cx="170" cy="127" rx="6" ry="2" fill="${c2}" opacity="0.2"/>

    <!-- ====== HEEL COUNTER ====== -->
    <path d="M28 120 L32 90 L34 82 L50 76 L52 86 L48 92 L204 92 L208 120 Z"
      fill="url(#${holoId})" opacity="0.6" stroke="${c1}" strokeWidth="1.2" strokeOpacity="0.7" filter="url(#${outlineId})"/>

    <!-- Heel stabilizer -->
    <path d="M30 118 L34 95 L38 90 L42 92 L40 118 Z"
      fill="${c2}" opacity="0.25" stroke="${c2}" strokeWidth="0.8"/>

    <!-- ====== TOE CAP ====== -->
    <path d="M170 80 L206 80 L214 120 L208 124 L168 124 L164 100 Z"
      fill="url(#${holoId})" opacity="0.65" stroke="${c1}" strokeWidth="1" strokeOpacity="0.6" filter="url(#${outlineId})"/>

    <!-- Toe cap reinforcement lines -->
    <path d="M172 84 Q190 82 206 84" stroke="${c2}" strokeWidth="0.6" fill="none" strokeOpacity="0.4"/>
    <path d="M170 90 Q188 88 208 90" stroke="${c2}" strokeWidth="0.6" fill="none" strokeOpacity="0.3"/>

    <!-- ====== UPPER (main body) ====== -->
    <path d="M34 82 L38 60 L50 42 L70 28 L95 16 L140 20 L170 36 L180 52 L184 66 L206 80 L170 80 L48 92 Z"
      fill="url(#${holoId})" opacity="0.7" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3"/>

    <!-- ====== ANKLE COLLAR ====== -->
    <path d="M34 82 L36 64 L42 48 L56 34 L70 28 L50 42 L38 60 Z"
      fill="${c1}" opacity="0.4" stroke="${c2}" strokeWidth="1" strokeOpacity="0.6"/>

    <!-- Collar padding detail -->
    <path d="M36 76 L40 60 L46 48" stroke="#ffffff" strokeWidth="0.8" fill="none" strokeOpacity="0.2"/>

    <!-- ====== LACE EYELETS & TONGUE ====== -->
    <path d="M60 52 L82 36 L110 30 L140 34 L164 46 L170 52 L60 52 Z"
      fill="${c2}" opacity="0.15" stroke="${c1}" strokeWidth="0.8" strokeOpacity="0.5"/>

    <!-- Lace eyelets -->
    <circle cx="75" cy="42" r="2.5" fill="none" stroke="${c2}" strokeWidth="1" strokeOpacity="0.7"/>
    <circle cx="95" cy="36" r="2.5" fill="none" stroke="${c2}" strokeWidth="1" strokeOpacity="0.7"/>
    <circle cx="115" cy="34" r="2.5" fill="none" stroke="${c2}" strokeWidth="1" strokeOpacity="0.7"/>
    <circle cx="135" cy="36" r="2.5" fill="none" stroke="${c2}" strokeWidth="1" strokeOpacity="0.7"/>
    <circle cx="155" cy="42" r="2.5" fill="none" stroke="${c2}" strokeWidth="1" strokeOpacity="0.7"/>

    <!-- Lace strands -->
    <line x1="75" y1="42" x2="95" y2="36" stroke="${c1}" strokeWidth="0.6" strokeOpacity="0.5"/>
    <line x1="95" y1="36" x2="115" y2="34" stroke="${c1}" strokeWidth="0.6" strokeOpacity="0.5"/>
    <line x1="115" y1="34" x2="135" y2="36" stroke="${c1}" strokeWidth="0.6" strokeOpacity="0.5"/>
    <line x1="135" y1="36" x2="155" y2="42" stroke="${c1}" strokeWidth="0.6" strokeOpacity="0.5"/>

    <!-- ====== SIDE STRIPE / LOGO ====== -->
    <path d="M50 78 Q90 68 140 74 Q170 78 196 72"
      stroke="${c2}" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity="0.7" filter="url(#${glowId})"/>

    <!-- Secondary stripe -->
    <path d="M55 84 Q95 76 140 80 Q168 84 190 80"
      stroke="${c1}" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.5"/>

    <!-- ====== HEEL PULL TAB ====== -->
    <path d="M34 82 L30 76 L34 72 L38 76 L36 82"
      fill="${c2}" opacity="0.3" stroke="${c1}" strokeWidth="0.8"/>
    <path d="M32 76 L36 76" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.5"/>

    <!-- ====== STITCHING DETAILS ====== -->
    <path d="M42 90 L170 90" stroke="${c2}" strokeWidth="0.5" strokeDasharray="2,3" fill="none" strokeOpacity="0.4"/>
    <path d="M40 100 L172 100" stroke="${c1}" strokeWidth="0.5" strokeDasharray="2,3" fill="none" strokeOpacity="0.3"/>

    <!-- ====== HOLOGRAPHIC GLOW OVERLAY ====== -->
    <path d="M34 82 L38 60 L50 42 L70 28 L95 16 L140 20 L170 36 L180 52 L184 66 L206 80 L214 120 L206 124 L32 124 L28 120 Z"
      fill="none" stroke="url(#${holoId})" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#${glowId})"/>

    <!-- ====== MESH TEXTURE DOTS ====== -->
    <circle cx="60" cy="65" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="75" cy="58" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="90" cy="52" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="105" cy="48" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="120" cy="46" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="140" cy="48" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="155" cy="54" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="80" cy="72" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="100" cy="68" r="0.8" fill="${c2}" opacity="0.4"/>
    <circle cx="120" cy="66" r="0.8" fill="${c2}" opacity="0.4"/>

    <!-- ====== GLOWING ACCENT SPOTS ====== -->
    <circle cx="50" cy="80" r="3" fill="${c1}" opacity="0.3" filter="url(#${outlineId})"/>
    <circle cx="170" cy="76" r="3" fill="${c2}" opacity="0.3" filter="url(#${outlineId})"/>
    <circle cx="110" cy="60" r="4" fill="${c1}" opacity="0.15" filter="url(#${outlineId})"/>

    <!-- ====== PULSING ENERGY CORE ====== -->
    <circle cx="110" cy="72" r="8" fill="none" stroke="${c1}" strokeWidth="0.5" strokeOpacity="0.3">
      <animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>

    <!-- ====== TECHNICAL SPEC BADGES ====== -->
    <rect x="30" y="6" width="28" height="12" rx="3" fill="${c1}" opacity="0.15" stroke="${c1}" strokeWidth="0.5" strokeOpacity="0.3"/>
    <text x="44" y="15" fontFamily="monospace" fontSize="7" fill="${c1}" textAnchor="middle" opacity="0.7">NR-7</text>

    <rect x="185" y="6" width="28" height="12" rx="3" fill="${c2}" opacity="0.15" stroke="${c2}" strokeWidth="0.5" strokeOpacity="0.3"/>
    <text x="199" y="15" fontFamily="monospace" fontSize="7" fill="${c2}" textAnchor="middle" opacity="0.7">94%</text>
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
        {/* Outer glow aura */}
        <div
          className="absolute -inset-20 rounded-full opacity-40 blur-[120px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${c1}50, ${c2}25, transparent 70%)`,
            transform: `translate(${currentRef.current.x * 0.5}px, ${currentRef.current.y * 0.5}px)`,
          }}
        />

        {/* Orbiting planetary bodies */}
        <div className="absolute w-full h-full pointer-events-none z-10" style={{ perspective: "1000px" }}>
          {/* Small planet 1 - fast orbit */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${c2}, ${c1})`,
              boxShadow: `0 0 12px ${c1}60, 0 0 30px ${c1}30`,
              animation: "orbit-planet-1 8s linear infinite",
              left: "50%",
              top: "50%",
              marginLeft: "-6px",
              marginTop: "-6px",
            }}
          />
          {/* Small planet 2 - slow orbit */}
          <div
            className="absolute w-5 h-5 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${c1}, ${c2})`,
              boxShadow: `0 0 16px ${c2}60, 0 0 40px ${c2}20`,
              animation: "orbit-planet-2 12s linear infinite",
              left: "50%",
              top: "50%",
              marginLeft: "-10px",
              marginTop: "-10px",
            }}
          />
          {/* Tiny moon */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: "#ffffff",
              boxShadow: `0 0 6px ${c1}`,
              animation: "orbit-planet-3 5s linear infinite",
              left: "50%",
              top: "50%",
              marginLeft: "-3px",
              marginTop: "-3px",
            }}
          />
        </div>

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
              <ellipse cx="150" cy="150" rx="140" ry="40" fill="none" stroke={`${c1}40`} strokeWidth="0.8" transform="rotate(-15 150 150)" />
              <ellipse cx="150" cy="150" rx="130" ry="35" fill="none" stroke={`${c2}35`} strokeWidth="0.6" transform="rotate(10 150 150)" />
              <ellipse cx="150" cy="150" rx="145" ry="30" fill="none" stroke={`${c1}25`} strokeWidth="0.4" transform="rotate(35 150 150)" />
              {/* Extra inner ring */}
              <ellipse cx="150" cy="150" rx="110" ry="25" fill="none" stroke={`${c2}20`} strokeWidth="0.4" strokeDasharray="3,5" transform="rotate(-25 150 150)" />
            </svg>

            {/* Holographic sneaker display */}
            <div className="holographic-sneaker-3d">
              <div className="holographic-sneaker-3d__shimmer" />
              <div className="holographic-sneaker-3d__scanline" />
              <div
                className="holographic-sneaker-3d__image"
                dangerouslySetInnerHTML={{ __html: buildSneakerSVG(`prism-${activeIndex}`, c1, c2) }}
              />
              {/* Orbital data dots */}
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "8%", left: "15%", animationDelay: "0s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "85%", left: "85%", animationDelay: "1.5s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "12%", left: "78%", animationDelay: "0.8s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "88%", left: "10%", animationDelay: "2.2s" }} />
              <div className="holographic-sneaker-3d__orbital-dot" style={{ top: "50%", left: "5%", animationDelay: "0.4s" }} />
            </div>
          </div>

          {/* Corner labels */}
          <span className="crystal-prism-3d__corner-label crystal-prism-3d__corner-label--tl" style={{ color: c1 }}>
            ▲ {currentSpecs.model}
          </span>
          <span className="crystal-prism-3d__corner-label crystal-prism-3d__corner-label--tr" style={{ color: c2 }}>
            {currentSpecs.tier} TIER
          </span>
          <span className="crystal-prism-3d__corner-label crystal-prism-3d__corner-label--br">
            COSMIC KICKS
          </span>
        </div>
      </div>

      {/* Interactive hint */}
      <p className="mt-6 text-[10px] font-medium tracking-[0.2em] uppercase text-white/30 animate-pulse">
        Click to explore &middot; Drag to rotate
      </p>
    </div>
  );
}