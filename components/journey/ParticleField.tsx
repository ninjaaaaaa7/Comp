'use client';

import { useEffect, useRef } from 'react';
import { useEffectiveReducedMotion } from '@/lib/motionPreference';
import { cn } from '@/lib/utils';

interface ParticleFieldProps {
  /** Number of particles. Default: 40. */
  count?: number;
  /** Fill colour as a hex string. Default: '#FFB23E' (gold). */
  color?: string;
  /**
   * When true, fades the canvas opacity to 0 after ~1.6 s over 0.8 s,
   * then stops the loop — useful for one-shot ambient effects.
   */
  fade?: boolean;
  className?: string;
}

interface Particle {
  x: number; y: number; r: number;
  vy: number; sway: number; phase: number;
}

/** Parse '#RRGGBB' → [r, g, b]. Falls back to gold on failure. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [isNaN(r) ? 255 : r, isNaN(g) ? 178 : g, isNaN(b) ? 62 : b];
}

/**
 * ParticleField — native-canvas slow upward drift.
 *
 * Particles rise with gentle horizontal sine sway; opacity oscillates between
 * 0.15–0.40. DPR-aware, pauses when off-screen via IntersectionObserver.
 * Fully cleaned up on unmount.
 *
 * Reduced motion: renders null — existing static decorations remain.
 */
export function ParticleField({
  count = 40,
  color = '#FFB23E',
  fade = false,
  className,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useEffectiveReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const [cr, cg, cb] = hexToRgb(color);

    let running = false;
    let rafId = 0;
    let frame = 0;
    let startMs: number | null = null;
    let inView = false; // tracks IntersectionObserver state

    // --- sizing ---
    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      // setTransform resets accumulated scale before reapplying.
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // --- particle lifecycle ---
    function spawnAt(p: Particle, w: number, h: number, scatter = false) {
      p.x = Math.random() * w;
      p.y = scatter ? Math.random() * h : h + Math.random() * 30;
      p.r = 1 + Math.random() * 1.5;
      p.vy = 0.1 + Math.random() * 0.3;
      p.sway = 0.3 + Math.random() * 0.25;
      p.phase = Math.random() * Math.PI * 2;
    }

    resize();

    const particles: Particle[] = Array.from({ length: count }, () => {
      const p: Particle = { x: 0, y: 0, r: 0, vy: 0, sway: 0, phase: 0 };
      spawnAt(p, canvas.offsetWidth, canvas.offsetHeight, true);
      return p;
    });

    // --- draw loop ---
    function draw(ts: number) {
      if (!running) return;
      if (startMs === null) startMs = ts;

      // Fade logic
      if (fade) {
        const elapsed = ts - startMs;
        const FADE_START = 1600, FADE_DUR = 800;
        if (elapsed >= FADE_START) {
          const t = Math.min((elapsed - FADE_START) / FADE_DUR, 1);
          canvas!.style.opacity = String(1 - t);
          if (t >= 1) { running = false; return; }
        }
      }

      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);
      frame++;

      for (const p of particles) {
        p.y -= p.vy;
        p.x += Math.sin(frame * 0.018 + p.phase) * p.sway;
        if (p.y < -p.r * 2) spawnAt(p, w, h, false);

        const op = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(frame * 0.025 + p.phase));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cr},${cg},${cb},${op.toFixed(3)})`;
        ctx!.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // Pause when off-screen (matches LottiePlayer pattern).
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) startLoop();
        else stopLoop();
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);

    // Also pause when the browser tab goes to background.
    function onVisibilityChange() {
      if (document.hidden) stopLoop();
      else if (inView) startLoop();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [count, color, fade]);

  // Render null for reduced-motion users — existing static decorations remain.
  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
    />
  );
}
