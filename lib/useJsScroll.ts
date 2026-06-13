'use client';

import { useScroll } from 'framer-motion';

type UseScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>;

/**
 * useScroll, forced onto the JS update path.
 *
 * framer-motion 12 promotes scroll-linked opacity/transform to native WAAPI
 * ScrollTimeline/ViewTimeline animations when supported. For targets inside
 * `position: sticky` containers (our 250vh/520vh journey sections) the
 * ViewTimeline range mapping desyncs from the JS scrollYProgress — opacity
 * freezes at stale values while derived values stay correct.
 *
 * Stripping the internal `accelerate` config before motion components consume
 * the values prevents the WAAPI promotion entirely; everything runs on the
 * classic per-frame JS pipeline, which tracks correctly (including with Lenis).
 */
export function useJsScroll(options?: UseScrollOptions) {
  const values = useScroll(options);
  // `accelerate` is internal — not in the public MotionValue type.
  (values.scrollXProgress as unknown as { accelerate?: unknown }).accelerate = undefined;
  (values.scrollYProgress as unknown as { accelerate?: unknown }).accelerate = undefined;
  return values;
}
