'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * useRevealInView — reliable "reveal on scroll into view" trigger.
 *
 * The original blank-section bug was caused by `whileInView` viewport `amount`
 * thresholds (0.2–0.5) that a last-on-page section can never reach — so it
 * stayed at opacity:0 forever. The fix is simply `amount: 'some'`: reveal as
 * soon as ANY pixel of the element is visible. A generous `margin` pre-triggers
 * a touch early for smoothness. `once` latches it. Reduced motion → instant.
 *
 * Uses framer-motion's IntersectionObserver (passive, no per-frame layout reads)
 * — NOT a custom scroll scanner, which thrashed layout and caused site-wide lag.
 */

interface Opts {
  amount?: 'some' | 'all' | number;
  margin?: string;
  once?: boolean;
  /** false when a parent group drives this element. */
  enabled?: boolean;
}

export function useRevealInView<T extends Element = HTMLDivElement>(opts: Opts = {}) {
  const {
    amount = 'some',
    margin = '0px 0px 200px 0px', // pre-trigger ~200px before entering
    once = true,
    enabled = true,
  } = opts;

  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const io = useInView(ref, { once, amount, margin: margin as `${number}px` });

  // Fail-safe for refresh-into-a-lower-section: if the browser restores scroll so
  // this element is already on screen at mount, reveal it directly. Without this,
  // a missed IntersectionObserver callback after scroll restoration can leave the
  // section stuck at opacity:0 (it flashes in from SSR, then disappears).
  const [onScreenAtMount, setOnScreenAtMount] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setOnScreenAtMount(true);
    };
    const raf = requestAnimationFrame(check);
    // Re-check after scroll restoration, which can land a few hundred ms in.
    const t1 = setTimeout(check, 300);
    const t2 = setTimeout(check, 800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [enabled]);

  return { ref, revealed: enabled ? reduce || io || onScreenAtMount : false };
}
