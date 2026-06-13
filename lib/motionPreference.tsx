'use client';

/**
 * Motion preference — single source of truth for "should animations play?".
 *
 * Why this exists: the OS-level `prefers-reduced-motion` (e.g. Windows
 * "animation effects off") makes the whole site appear static. This lets the
 * user FORCE motion on regardless of the OS, via a visible toggle.
 *
 * - `forceMotion` defaults to ON so animations are visible out of the box.
 * - When ON: wraps the tree in <MotionConfig reducedMotion="never"> (all
 *   framer-motion animations ignore the OS) AND adds `.force-motion` to <html>
 *   (so the CSS reduced-motion override in globals.css is bypassed too).
 * - When OFF: falls back to the OS preference ("user").
 * - Non-framer consumers (Lottie, Spline, Lenis) call useEffectiveReducedMotion().
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

const STORAGE_KEY = 'companio_force_motion';

interface MotionPrefCtx {
  forceMotion: boolean;
  setForceMotion: (v: boolean) => void;
  toggle: () => void;
  mounted: boolean;
}

const Ctx = createContext<MotionPrefCtx>({
  forceMotion: true,
  setForceMotion: () => {},
  toggle: () => {},
  mounted: false,
});

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  // Default ON — motion is visible by default.
  const [forceMotion, setForceMotionState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '0') setForceMotionState(false);
      else if (stored === '1') setForceMotionState(true);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('force-motion', forceMotion);
    try {
      localStorage.setItem(STORAGE_KEY, forceMotion ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [forceMotion]);

  const setForceMotion = useCallback((v: boolean) => setForceMotionState(v), []);
  const toggle = useCallback(() => setForceMotionState((v) => !v), []);

  return (
    <Ctx.Provider value={{ forceMotion, setForceMotion, toggle, mounted }}>
      <MotionConfig reducedMotion={forceMotion ? 'never' : 'user'}>{children}</MotionConfig>
    </Ctx.Provider>
  );
}

export function useMotionPreference() {
  return useContext(Ctx);
}

/**
 * For non-framer-motion consumers (Lottie / Spline / Lenis).
 * Returns true only when we SHOULD reduce motion: i.e. force is off AND the OS
 * asks for reduced motion. Pre-hydration it returns false (motion-on default).
 */
export function useEffectiveReducedMotion(): boolean {
  const { forceMotion, mounted } = useMotionPreference();
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(mq.matches);
    const on = () => setSystemReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  if (!mounted) return false;
  return !forceMotion && systemReduced;
}
