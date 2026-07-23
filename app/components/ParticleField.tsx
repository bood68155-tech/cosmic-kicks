"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  opacity: number;
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
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const nebulaOrbsRef = useRef<NebulaOrb[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.3,
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  const initNebulaOrbs = useCallback((w: number, h: number) => {
    const orbs: NebulaOrb[] = [
      { x: w * 0.2, y: h * 0.3, radius: w * 0.35, hue: 260, saturation: 70, lightness: 15, pulsePhase: 0, pulseSpeed: 0.3 },
      { x: w * 0.8, y: h * 0.6, radius: w * 0.3, hue: 190, saturation: 60, lightness: 12, pulsePhase: 1.5, pulseSpeed: 0.2 },
      { x: w * 0.5, y: h * 0.8, radius: w * 0.25, hue: 330, saturation: 50, lightness: 10, pulsePhase: 3, pulseSpeed: 0.25 },
      { x: w * 0.1, y: h * 0.7, radius: w * 0.2, hue: 220, saturation: 65, lightness: 8, pulsePhase: 4.5, pulseSpeed: 0.15 },
      { x: w * 0.9, y: h * 0.2, radius: w * 0.18, hue: 290, saturation: 55, lightness: 10, pulsePhase: 2, pulseSpeed: 0.35 },
    ];
    nebulaOrbsRef.current = orbs;
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
    const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.8;
    const speed = Math.random() * 0.3 + 0.1;
    const maxLife = Math.random() * 200 + 100;
    return {
      x, y, z: Math.random() * 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.5 + 1,
      opacity: 0,
      hue: Math.random() * 60 + 240,
      life: 0,
      maxLife,
    } as Particle;
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
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handleMouse);

    // Pre-populate particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      initialParticles.push(spawnParticle(dimsRef.current.w, dimsRef.current.h));
    }
    particlesRef.current = initialParticles;

    const animate = () => {
      frameRef.current++;
      const { w, h } = dimsRef.current;

      // Draw background
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Draw nebula orbs
      nebulaOrbsRef.current.forEach((orb) => {
        orb.pulsePhase += 0.005 * orb.pulseSpeed;
        const pulse = Math.sin(orb.pulsePhase) * 0.15 + 0.85;
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * pulse);
        gradient.addColorStop(0, `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness + 5}%, 0.12)`);
        gradient.addColorStop(0.5, `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%, 0.06)`);
        gradient.addColorStop(1, `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      // Draw stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(frameRef.current * 0.02 * star.twinkleSpeed + star.twinklePhase) * 0.4 + 0.6;
        const alpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw particles
      const { x: mx, y: my } = mouseRef.current;
      const cx = mx * w;
      const cy = my * h;

      // Spawn new particles
      if (particlesRef.current.length < 80 && Math.random() < 0.3) {
        particlesRef.current.push(spawnParticle(w, h));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        // Attract toward mouse
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && dist > 1) {
          const force = 0.0003 * (300 - dist) / dist;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Fade in / out
        const fadeIn = Math.min(p.life / 30, 1);
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 30) / 30, 0);
        const alpha = fadeIn * fadeOut * 0.6;

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${alpha * 0.2})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${alpha})`;
        ctx.fill();

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
  }, [initStars, initNebulaOrbs, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
