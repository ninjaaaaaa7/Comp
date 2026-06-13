'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { useEffectiveReducedMotion } from '@/lib/motionPreference';

// Transactional / form routes use calm motion — Lenis adds no value
// and can interfere with virtual-scroll form UX.
const DISABLED_ROUTES = [
  '/book',
  '/dashboard',
  '/pricing',
  '/quiz',
  '/login',
  '/register',
  '/companion-dashboard',
  '/become-a-companion/apply',
];

interface LenisProviderProps {
  children: React.ReactNode;
  /** Hard-disable from a parent component (e.g. a special route layout). */
  disabled?: boolean;
}

export function LenisProvider({ children, disabled = false }: LenisProviderProps) {
  const pathname = usePathname();

  const routeDisabled = DISABLED_ROUTES.some((r) => pathname?.startsWith(r));
  const shouldDisable = disabled || routeDisabled;
  const reducedMotion = useEffectiveReducedMotion();

  useEffect(() => {
    if (shouldDisable || reducedMotion) return;

    // data-saver also opts out of smooth scroll.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      // Lower lerp = smoother, more "buttery" glide (settles a touch slower).
      lerp: isMobile ? 0.1 : 0.085,
      // <1 reduces scroll sensitivity so fast wheel flicks feel calmer/smoother.
      wheelMultiplier: 0.85,
      touchMultiplier: 1.6,
    });

    let rafId: number;
    function tick(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [shouldDisable, reducedMotion]);

  return <>{children}</>;
}
