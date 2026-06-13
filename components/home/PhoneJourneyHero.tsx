'use client';

import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { useJsScroll } from '@/lib/useJsScroll';
import { PhoneBrowse } from './phone/PhoneBrowse';
import { PhoneProfile } from './phone/PhoneProfile';
import { PhoneConfirmed } from './phone/PhoneConfirmed';
import { HeroCopyState0, HeroCopyState1, HeroCopyState2 } from './phone/HeroCopy';
import { PhoneChipsWrapper } from './phone/PhoneChips';
import { useIsMobile } from '@/lib/useIsMobile';

const FRAME_SHADOW =
  '0 0 0 1px rgba(46,107,255,0.25), 0 40px 80px -20px rgba(20,18,42,0.45), inset 0 1px 0 rgba(255,255,255,0.08)';

function AmbientBlobs() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-15 blur-2xl" style={{ background: 'var(--color-azure)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-[0.12] blur-2xl" style={{ background: 'var(--color-violet)' }} />
    </>
  );
}

/**
 * Orchestrator for the 250 vh scroll-driven phone hero (§3.1).
 * Three states swap inside one constant phone frame; left text cross-fades in sync.
 * Reduced motion: collapses to a static min-h-screen single-state layout (no scroll binding).
 */
export function PhoneJourneyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useJsScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Shared opacity bands — screen and its text block share the same curve.
  // Sequential, NON-overlapping: each state fades fully out before the next
  // fades in (small gap between bands). Overlapping crossfades superimposed
  // two headlines in the same spot mid-transition — unreadable in stills.
  const opA = useTransform(scrollYProgress, [0, 0.26, 0.34], [1, 1, 0]);             // state 0
  const opB = useTransform(scrollYProgress, [0.38, 0.46, 0.60, 0.68], [0, 1, 1, 0]); // state 1
  const opC = useTransform(scrollYProgress, [0.72, 0.80, 1], [0, 1, 1]);             // state 2

  // Incoming y for states 1 + 2 (spring-feel from eased transform range)
  const yProf = useTransform(scrollYProgress, [0.38, 0.46], [18, 0]);
  const yConf = useTransform(scrollYProgress, [0.72, 0.80], [18, 0]);

  // Text y offsets: out-going exits −24, incoming enters from +24
  const y0 = useTransform(scrollYProgress, [0, 0.26, 0.34], [0, 0, -24]);
  const y1 = useTransform(scrollYProgress, [0.38, 0.46, 0.60, 0.68], [24, 0, 0, -24]);
  const y2 = useTransform(scrollYProgress, [0.72, 0.80, 1], [24, 0, 0]);

  // Device micro-tilt: subtle life across the full scroll range
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);

  // Disable pointer events on state-0 CTAs once they have faded out.
  const ptr0 = useTransform(opA, (v) => (v < 0.3 ? 'none' : 'auto'));

  // ── Static branch: reduced motion OR mobile (scene clips/janks <md) ──────
  if (shouldReduce || isMobile) {
    return (
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'var(--grad-hero-bg)' }}
      >
        <AmbientBlobs />
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-32 w-full grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <HeroCopyState0 />
          <div className="flex items-center justify-center">
            <div
              className="rounded-[2.5rem] overflow-hidden shrink-0"
              style={{ width: 272, height: 540, border: '7px solid #141A2E', boxShadow: FRAME_SHADOW, background: '#F7F8FC' }}
            >
              <PhoneBrowse />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Full scroll-driven scene ─────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative"
      style={{ height: '250vh', background: 'var(--grad-hero-bg)' }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <AmbientBlobs />
        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 lg:gap-24 items-center py-16">

          {/* Left: state 0 sizes the column in normal flow (it is the tallest);
              states 1–2 overlay it, vertically centered. Prevents the
              clipping/overlap that a fixed min-height absolute stack caused. */}
          <div className="relative">
            <motion.div style={{ opacity: opA, y: y0, pointerEvents: ptr0, willChange: 'transform, opacity' }}>
              <HeroCopyState0 />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex flex-col justify-center"
              style={{ opacity: opB, y: y1, willChange: 'transform, opacity' }}
            >
              <HeroCopyState1 />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex flex-col justify-center"
              style={{ opacity: opC, y: y2, willChange: 'transform, opacity' }}
            >
              <HeroCopyState2 />
            </motion.div>
          </div>

          {/* Right: chips wrapper → micro-tilt wrapper → phone frame → 3 screens */}
          <PhoneChipsWrapper scrollYProgress={scrollYProgress}>
            <motion.div className="relative" style={{ rotate }}>
              {/* Constant phone frame — never remounts */}
              <div
                className="relative rounded-[2.5rem] overflow-hidden shrink-0"
                style={{ width: 272, height: 540, border: '7px solid #141A2E', boxShadow: FRAME_SHADOW, background: '#F7F8FC' }}
              >
                <motion.div className="absolute inset-0" style={{ opacity: opA, willChange: 'opacity' }}>
                  <PhoneBrowse />
                </motion.div>
                <motion.div className="absolute inset-0" style={{ opacity: opB, y: yProf, willChange: 'transform, opacity' }}>
                  <PhoneProfile />
                </motion.div>
                <motion.div className="absolute inset-0" style={{ opacity: opC, y: yConf, willChange: 'transform, opacity' }}>
                  <PhoneConfirmed />
                </motion.div>
              </div>

              {/* Aurora progress tick: 2px, scaleY mirrors scrollYProgress */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: -3,
                  top: 0,
                  height: '100%',
                  width: 2,
                  background: 'var(--grad-aurora)',
                  scaleY: scrollYProgress,
                  transformOrigin: 'top',
                }}
              />
            </motion.div>
          </PhoneChipsWrapper>

        </div>
      </div>
    </section>
  );
}
