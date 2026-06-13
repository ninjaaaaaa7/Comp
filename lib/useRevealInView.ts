'use client';

import { useRef } from 'react';
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

  return { ref, revealed: enabled ? reduce || io : false };
}
