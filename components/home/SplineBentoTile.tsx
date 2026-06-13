'use client';

/**
 * SplineBentoTile — lazy, desktop-gated Spline embed for the BentoSection centerpiece.
 *
 * Renders the iframe ONLY when:
 *   1. Desktop (≥1024px viewport width)
 *   2. prefers-reduced-motion is NOT active
 *   3. The tile has entered the viewport (IntersectionObserver)
 *
 * Fallback (mobile / reduced-motion / not yet in view):
 *   Deep-purple gradient tile with the Companio Seal + a short label.
 *   Intentionally NOT the phone mockup — keeps bento visually distinct from the hero.
 */

import { useEffect, useRef, useState } from 'react';
import { Seal } from '@/components/ui/Seal';
import { useEffectiveReducedMotion } from '@/lib/motionPreference';

const SPLINE_URL =
  'https://my.spline.design/hands3duicopy-5pmCVbPEJwFttciTpdDA5DIh/';

interface SplineBentoTileProps {
  /** Extra Tailwind / CSS classes for grid placement. Passed to the root div. */
  className?: string;
}

export function SplineBentoTile({ className = '' }: SplineBentoTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const reducedMotion = useEffectiveReducedMotion();

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop || reducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          obs.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        border: '1.5px solid rgba(122,79,224,0.28)',
        boxShadow:
          '0 0 0 1px rgba(46,107,255,0.08), 0 24px 64px rgba(20,18,42,0.35), 0 0 40px rgba(122,79,224,0.14)',
      }}
    >
      {shouldRender ? (
        <>
          {/* Loading shimmer — fades out once iframe fires onLoad */}
          {!iframeReady && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: 'linear-gradient(145deg, #1e1a3a 0%, #2a2050 100%)' }}
            />
          )}

          {/*
           * scale(1.3) enlarges the scene so the "Built with Spline" badge
           * (bottom-right corner of the iframe) overflows past the container's
           * overflow-hidden boundary and is cropped out of view.
           * translateY(-3%) nudges the scene upward so the hands+phone focal
           * point stays vertically centred after the scale.
           */}
          <iframe
            src={SPLINE_URL}
            title="Interactive 3D Companio scene"
            loading="lazy"
            allow="autoplay"
            className="absolute inset-0 border-0 w-full h-full"
            onLoad={() => setIframeReady(true)}
            style={{
              opacity: iframeReady ? 1 : 0,
              transition: 'opacity 0.6s ease',
              transform: 'scale(1.3) translateY(-3%)',
              transformOrigin: 'center center',
            }}
          />

          {/* Brand seal — centered over the phone in the 3D scene */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ filter: 'drop-shadow(0 0 6px rgba(122,79,224,0.55))' }}
          >
            <Seal size={32} decorative />
          </div>
        </>
      ) : (
        /* Static fallback: gradient tile with Seal + label */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={{
            background:
              'linear-gradient(145deg, #14122A 0%, #241E48 60%, #1A1040 100%)',
          }}
        >
          {/* Subtle ambient ring */}
          <div
            className="absolute w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7A4FE0 0%, #2E6BFF 100%)' }}
          />
          <div
            style={{
              filter: 'drop-shadow(0 0 16px rgba(122,79,224,0.55))',
              position: 'relative',
            }}
          >
            <Seal size={64} decorative />
          </div>
          <p
            className="font-sans font-semibold text-sm tracking-widest uppercase relative"
            style={{ color: 'rgba(244,242,255,0.45)', letterSpacing: '0.12em' }}
          >
            Companio
          </p>
        </div>
      )}
    </div>
  );
}
