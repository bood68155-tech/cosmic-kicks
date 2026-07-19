'use client';

import { useEffect, useRef, useMemo } from 'react';

/* ─── Generate a deterministic pseudo-random from a seed ─── */
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ─── Star config ─── */
interface StarConfig {
  left: string;
  top: string;
  className: string;
  duration: string;
  delay: string;
  twinkleMin: string;
  twinkleMax: string;
}

/* ─── Nebula config ─── */
interface NebulaConfig {
  className: string;
  left: string;
  top: string;
}

/* ─── Planet config ─── */
interface PlanetConfig {
  className: string;
  left: string;
  top: string;
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Memoize static config so it's only computed once */
  const { stars, nebulaConfigs, planetConfigs } = useMemo(() => {
    const rand = seededRandom(42);
    const s: StarConfig[] = [];
    const totalStars = 350;

    for (let i = 0; i < totalStars; i++) {
      const size = rand();
      let className = 'star';

      // Assign glow type based on position and randomness
      const glowRoll = rand();

      if (size < 0.05) {
        // Rare: extra-bright glowing stars
        if (glowRoll < 0.3) className += ' star--glow-blue';
        else if (glowRoll < 0.55) className += ' star--glow-gold';
        else if (glowRoll < 0.75) className += ' star--glow-red';
        else className += ' star--glow-white';
      } else if (size < 0.2) {
        className += ' star--large';
      } else if (size > 0.75) {
        className += ' star--small';
      }

      s.push({
        left: `${rand() * 100}%`,
        top: `${rand() * 100}%`,
        className,
        duration: `${2 + rand() * 4}s`,
        delay: `${rand() * 5}s`,
        twinkleMin: `${0.05 + rand() * 0.25}`,
        twinkleMax: `${0.4 + rand() * 0.6}`,
      });
    }

    /* ─── Nebula clouds ─── */
    const n: NebulaConfig[] = [
      { className: 'nebula nebula--purple', left: '10%', top: '15%' },
      { className: 'nebula nebula--blue', left: '70%', top: '25%' },
      { className: 'nebula nebula--teal', left: '50%', top: '70%' },
      { className: 'nebula nebula--pink', left: '85%', top: '60%' },
      { className: 'nebula nebula--gold', left: '25%', top: '80%' },
    ];

    /* ─── Planets ─── */
    const p: PlanetConfig[] = [
      { className: 'planet planet--gas-giant', left: '75%', top: '8%' },
      { className: 'planet planet--ringed', left: '12%', top: '55%' },
      { className: 'planet planet--ice', left: '60%', top: '82%' },
      { className: 'planet planet--rocky', left: '88%', top: '45%' },
    ];

    return { stars: s, nebulaConfigs: n, planetConfigs: p };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLElement[] = [];

    /* ─── 1. Nebula clouds ─── */
    nebulaConfigs.forEach((cfg) => {
      const el = document.createElement('div');
      el.className = cfg.className;
      el.style.left = cfg.left;
      el.style.top = cfg.top;
      container.appendChild(el);
      elements.push(el);
    });

    /* ─── 2. Planets ─── */
    planetConfigs.forEach((cfg) => {
      const el = document.createElement('div');
      el.className = cfg.className;
      el.style.left = cfg.left;
      el.style.top = cfg.top;
      container.appendChild(el);
      elements.push(el);
    });

    /* ─── 3. Stars ─── */
    const starEls: HTMLDivElement[] = [];
    stars.forEach((cfg) => {
      const star = document.createElement('div');
      star.className = cfg.className;
      star.style.left = cfg.left;
      star.style.top = cfg.top;
      star.style.setProperty('--duration', cfg.duration);
      star.style.setProperty('--delay', cfg.delay);
      star.style.setProperty('--twinkle-min', cfg.twinkleMin);
      star.style.setProperty('--twinkle-max', cfg.twinkleMax);
      starEls.push(star);
      container.appendChild(star);
    });
    elements.push(...starEls);

    /* ─── 4. Shooting stars (reuse existing markup) ─── */
    const shootingStars = container.querySelectorAll('.shooting-star');
    shootingStars.forEach((star, i) => {
      const el = star as HTMLElement;
      el.style.setProperty(
        '--shoot-delay',
        `${3 + i * 5 + Math.random() * 4}s`,
      );
      el.style.setProperty('--shoot-top', `${5 + Math.random() * 40}%`);
      el.style.setProperty('--shoot-left', `${50 + Math.random() * 45}%`);
    });

    /* ─── 6. Comets ─── */
    const comets = container.querySelectorAll('.comet');
    comets.forEach((comet, i) => {
      const el = comet as HTMLElement;
      el.style.setProperty('--comet-delay', `${8 + i * 12 + Math.random() * 5}s`);
      el.style.setProperty('--comet-top', `${3 + Math.random() * 30}%`);
      el.style.setProperty('--comet-left', `${55 + Math.random() * 40}%`);
    });

    return () => {
      elements.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="stars" aria-hidden="true">
      {/* Galaxy spirals (decorative rings, rendered in DOM) */}
      <div className="galaxy-spiral galaxy-spiral--1" />
      <div className="galaxy-spiral galaxy-spiral--2" />

      {/* Shooting stars */}
      <div className="shooting-star" />
      <div className="shooting-star" />
      <div className="shooting-star" />
      <div className="shooting-star" />

      {/* Comets */}
      <div className="comet">
        <div className="comet__tail" />
        <div className="comet__head" />
      </div>
      <div className="comet">
        <div className="comet__tail" />
        <div className="comet__head" />
      </div>
    </div>
  );
}
