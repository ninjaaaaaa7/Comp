'use client';

import { useEffect, useRef } from 'react';
import { useEffectiveReducedMotion } from '@/lib/motionPreference';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  count?: number;
  onDone?: () => void;
  className?: string;
}

interface Piece {
  x: number; y: number;
  vx: number; vy: number;
  r: number; rot: number; rotV: number;
  color: string; isCircle: boolean;
}

// Canvas cannot read CSS custom properties cheaply — hardcode the three brand hexes.
const COLORS = ['#2E6BFF', '#7A4FE0', '#FFB23E'] as const;
const DURATION_MS = 900;

export function Confetti({ count = 24, onDone, className }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useEffectiveReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h / 2;
    let startMs: number | null = null;
    let rafId = 0;
    let done = false;

    const pieces: Piece[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 2.8 + Math.random() * 3.5;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        r: 5 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.22,
        color: COLORS[i % COLORS.length],
        isCircle: i % 3 === 0,
      };
    });

    function draw(ts: number) {
      if (done) return;
      if (startMs === null) startMs = ts;
      const t = Math.min((ts - startMs) / DURATION_MS, 1);

      ctx!.clearRect(0, 0, w, h);

      for (const p of pieces) {
        p.vy += 0.14;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;

        ctx!.save();
        ctx!.globalAlpha = Math.max(0, 1 - t);
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.color;
        if (p.isCircle) {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.fillRect(-p.r * 0.5, -p.r * 0.25, p.r, p.r * 0.5);
        }
        ctx!.restore();
      }

      if (t < 1) {
        rafId = requestAnimationFrame(draw);
      } else {
        done = true;
        ctx!.clearRect(0, 0, w, h);
        onDone?.();
      }
    }

    rafId = requestAnimationFrame(draw);
    return () => {
      done = true;
      cancelAnimationFrame(rafId);
    };
  }, [count, onDone, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
    />
  );
}
