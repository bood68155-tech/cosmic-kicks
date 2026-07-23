"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  opacity: number;
  hue: number;
}

interface NebulaOrb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  saturation: number;
  lightness: number;
  pulsePhase: number;
  pulseSpeed: number;
  colorStops: { offset: number; color: string }[];
}

interface OrbitingPlanet {
  cx: number;
  cy: number;
  radius: number;
  angle: number;
  speed: number;
  size: number;
  hue: number;
  sat: number;
  light: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  hue: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const nebulaOrbsRef = useRef<NebulaOrb[]>([]);
  const planetsRef = useRef<OrbitingPlanet[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    // Base stars
    for (let i = 0; i < 500; i++) {
      const hueChoice = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 0.3,
        twinkleSpeed: Math.random() * 3 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.7 + 0.2,
        hue: hueChoice < 0.3 ? 260 + Math.random() * 40 : // purple
             hueChoice < 0.6 ? 190 + Math.random() * 30 : // cyan/blue
             hueChoice < 0.8 ? 220 + Math.random() * 20 : // blue-white
             0, // white
      });
    }
    // Bright accent stars
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 4 + 2,
        twinkleSpeed: Math.random() * 4 + 1,
        twinklePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.8 + 0.2,
        hue: [260, 190, 330, 220, 0][Math.floor(Math.random() * 5)],
      });
    }
    starsRef.current = stars;
  }, []);

  const initNebulaOrbs = useCallback((w: number, h: number) => {
    const orbs: NebulaOrb[] = [
      {
        x: w * 0.2, y: h * 0.25, radius: w * 0.4, hue: 265, saturation: 80, lightness: 18,
        pulsePhase: 0, pulseSpeed: 0.25,
        colorStops: [
          { offset: 0, color: "hsla(265, 80%, 20%, 0.18)" },
          { offset: 0.4, color: "hsla(265, 70%, 15%, 0.08)" },
          { offset: 1, color: "hsla(265, 60%, 10%, 0)" },
        ],
      },
      {
        x: w * 0.8, y: h * 0.55, radius: w * 0.35, hue: 195, saturation: 75, lightness: 16,
        pulsePhase: 1.8, pulseSpeed: 0.2,
        colorStops: [
          { offset: 0, color: "hsla(195, 75%, 18%, 0.16)" },
          { offset: 0.4, color: "hsla(195, 65%, 13%, 0.07)" },
          { offset: 1, color: "hsla(195, 55%, 8%, 0)" },
        ],
      },
      {
        x: w * 0.5, y: h * 0.8, radius: w * 0.3, hue: 335, saturation: 65, lightness: 14,
        pulsePhase: 3.2, pulseSpeed: 0.3,
        colorStops: [
          { offset: 0, color: "hsla(335, 65%, 16%, 0.14)" },
          { offset: 0.4, color: "hsla(335, 55%, 12%, 0.06)" },
          { offset: 1, color: "hsla(335, 45%, 8%, 0)" },
        ],
      },
      {
        x: w * 0.1, y: h * 0.7, radius: w * 0.25, hue: 225, saturation: 70, lightness: 12,
        pulsePhase: 4.8, pulseSpeed: 0.18,
        colorStops: [
          { offset: 0, color: "hsla(225, 70%, 14%, 0.12)" },
          { offset: 0.4, color: "hsla(225, 60%, 10%, 0.05)" },
          { offset: 1, color: "hsla(225, 50%, 7%, 0)" },
        ],
      },
      {
        x: w * 0.9, y: h * 0.15, radius: w * 0.22, hue: 295, saturation: 60, lightness: 13,
        pulsePhase: 2.5, pulseSpeed: 0.35,
        colorStops: [
          { offset: 0, color: "hsla(295, 60%, 15%, 0.13)" },
          { offset: 0.4, color: "hsla(295, 50%, 11%, 0.05)" },
          { offset: 1, color: "hsla(295, 40%, 7%, 0)" },
        ],
      },
    ];
    nebulaOrbsRef.current = orbs;
  }, []);

  const initPlanets = useCallback((w: number, h: number) => {
    const cx = w * 0.5;
    const cy = h * 0.5;
    planetsRef.current = [
      { cx, cy, radius: Math.min(w, h) * 0.15, angle: 0, speed: 0.003, size: 4, hue: 265, sat: 80, light: 65 },
      { cx, cy, radius: Math.min(w, h) * 0.25, angle: 2.1, speed: 0.002, size: 7, hue: 195, sat: 70, light: 60 },
      { cx, cy, radius: Math.min(w, h) * 0.08, angle: 5.8, speed: 0.008, size: 2.5, hue: 335, sat: 60, light: 70 },
      { cx, cy, radius: Math.min(w, h) * 0.2, angle: 4.2, speed: 0.0015, size: 3, hue: 45, sat: 65, light: 55 },
    ];
  }, []);

  const initComets = useCallback((w: number, h: number) => {
    cometsRef.current = [];
  }, []);

  const spawnParticle = useCallback((w: number, h: number) => {
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;
    switch (side) {
      case 0: x = Math.random() * w; y = -5; break;
      case 1: x = w + 5; y = Math.random() * h; break;
      case 2: x = Math.random() * w; y = h + 5; break;
      default: x = -5; y = Math.random() * h; break;
    }
    const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.6;
    const speed = Math.random() * 0.5 + 0.15;
    const maxLife = Math.random() * 250 + 150;
    const hueBase = [260, 190, 330, 220][Math.floor(Math.random() * 4)];
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1.5,
      opacity: 0,
      hue: hueBase + Math.random() * 30 - 15,
      life: 0,
      maxLife,
      trail: [] as { x: number; y: number }[],
    } as Particle;
  }, []);

  const spawnComet = useCallback((w: number, h: number) => {
    const fromTop = Math.random() > 0.5;
    return {
      x: Math.random() * w * 1.5 - w * 0.25,
      y: fromTop ? -10 : h + 10,
      vx: (Math.random() - 0.5) * 6,
      vy: fromTop ? Math.random() * 4 + 2 : -(Math.random() * 4 + 2),
      life: 0,
      maxLife: 60 + Math.random() * 40,
      length: 30 + Math.random() * 50,
      hue: [260, 190, 335, 220][Math.floor(Math.random() * 4)],
    } as Comet;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      dimsRef.current = { w, h };
      initStars(w, h);
      initNebulaOrbs(w, h);
      initPlanets(w, h);
      initComets(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handleMouse);

    const initialParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      initialParticles.push(spawnParticle(dimsRef.current.w, dimsRef.current.h));
    }
    particlesRef.current = initialParticles;

    let cometTimer = 0;

    const animate = () => {
      frameRef.current++;
      cometTimer++;
      const { w, h } = dimsRef.current;

      // Draw deep space background
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, "#0a0a18");
      bgGrad.addColorStop(0.5, "#070710");
      bgGrad.addColorStop(1, "#050508");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw nebula orbs
      nebulaOrbsRef.current.forEach((orb) => {
        orb.pulsePhase += 0.006 * orb.pulseSpeed;
        const pulse = Math.sin(orb.pulsePhase) * 0.12 + 0.88;
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * pulse);
        orb.colorStops.forEach((cs) => {
          gradient.addColorStop(cs.offset, cs.color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      // Draw orbiting planets
      planetsRef.current.forEach((p) => {
        p.angle += p.speed;
        const px = p.cx + Math.cos(p.angle) * p.radius;
        const py = p.cy + Math.sin(p.angle) * p.radius;

        // Planet glow
        const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
        glowGrad.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light + 10}%, 0.15)`);
        glowGrad.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        const planetGrad = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, 0, px, py, p.size);
        planetGrad.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light + 20}%, 0.9)`);
        planetGrad.addColorStop(0.7, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.8)`);
        planetGrad.addColorStop(1, `hsla(${p.hue}, ${p.sat - 10}%, ${p.light - 15}%, 0.6)`);
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw stars with color
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(frameRef.current * 0.02 * star.twinkleSpeed + star.twinklePhase) * 0.4 + 0.6;
        const alpha = star.opacity * twinkle;
        if (star.hue > 0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, 60%, 85%, ${alpha})`;
          ctx.fill();
          // Glow for colored stars
          if (star.size > 1.5) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${star.hue}, 60%, 80%, ${alpha * 0.1})`;
            ctx.fill();
          }
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      });

      // Draw particles with trails
      const { x: mx, y: my } = mouseRef.current;
      const cx = mx * w;
      const cy = my * h;

      if (particlesRef.current.length < 120 && Math.random() < 0.4) {
        particlesRef.current.push(spawnParticle(w, h));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        // Attract toward mouse
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 350 && dist > 1) {
          const force = 0.0004 * (350 - dist) / dist;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Slight orbital force
        const ox = w / 2 - p.x;
        const oy = h / 2 - p.y;
        const odist = Math.sqrt(ox * ox + oy * oy);
        if (odist > 100) {
          const orbForce = 0.00005;
          p.vx += (ox / odist) * orbForce;
          p.vy += (oy / odist) * orbForce;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        const fadeIn = Math.min(p.life / 20, 1);
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 20) / 20, 0);
        const alpha = fadeIn * fadeOut * 0.7;

        // Draw trail
        for (let i = 0; i < p.trail.length - 1; i++) {
          const t = p.trail[i];
          const trailAlpha = (i / p.trail.length) * alpha * 0.3;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${trailAlpha})`;
          ctx.fill();
        }

        // Particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha * 0.15})`;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${alpha})`;
        ctx.fill();

        return true;
      });

      // Draw comets
      if (cometTimer > 200 + Math.random() * 300) {
        cometTimer = 0;
        cometsRef.current.push(spawnComet(w, h));
      }

      cometsRef.current = cometsRef.current.filter((c) => {
        c.life++;
        c.x += c.vx;
        c.y += c.vy;
        if (c.life > c.maxLife || c.x < -100 || c.x > w + 100 || c.y < -100 || c.y > h + 100) return false;

        const progress = c.life / c.maxLife;
        const alpha = progress < 0.2 ? progress * 5 : progress > 0.8 ? (1 - progress) * 5 : 1;
        const headAlpha = alpha * 0.8;

        // Comet head
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${c.hue}, 90%, 90%, ${headAlpha})`;
        ctx.fill();

        // Comet tail
        const tailAngle = Math.atan2(c.vy, c.vx);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        const tailX = c.x - Math.cos(tailAngle) * c.length;
        const tailY = c.y - Math.sin(tailAngle) * c.length;
        const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        tailGrad.addColorStop(0, `hsla(${c.hue}, 90%, 90%, ${alpha * 0.6})`);
        tailGrad.addColorStop(0.3, `hsla(${c.hue}, 80%, 70%, ${alpha * 0.2})`);
        tailGrad.addColorStop(1, `hsla(${c.hue}, 70%, 50%, 0)`);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [initStars, initNebulaOrbs, initPlanets, initComets, spawnParticle, spawnComet]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}