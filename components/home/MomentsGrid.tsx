'use client';

/**
 * MomentsGrid — 4-block varied bento grid of Lottie animations.
 *
 * Desktop (lg, 4-col, 2 rows) layout:
 *   ┌─────────────────────┬──────────┬──────────┐
 *   │  scene-2  (2×2)     │  fish    │ scene-1  │   row 1
 *   │  City energy        │  Out &   │  Calm    │
 *   │                     │  about   │  moments │
 *   │                     ├──────────┴──────────┤
 *   │                     │  cat (2 wide)        │   row 2
 *   └─────────────────────┴──────────────────────┘
 *
 * md: 2-col auto-flow (scene-2 + cat span both cols).
 * mobile: 1-col stacked.
 *
 * birdies is intentionally NOT here — it lives as PeopleSection's ambient
 * decoration, so it isn't duplicated.
 *
 * At most 4 Lotties animate concurrently (down from 6 with the old birdies
 * dup), and each pauses off-screen via LottiePlayer's IntersectionObserver.
 * Blocks have defined min-heights → no layout shift.
 * Reduced-motion → all Lotties freeze on first frame (LottiePlayer handles).
 */

import { motion } from 'framer-motion';
import { Reveal } from '@/components/motion/Reveal';
import { LottiePlayer } from '@/components/motion/LottiePlayer';

interface Block {
  id: string;
  src: string;
  caption: string | null;
  /** Lottie intrinsic size — keeps aspect ratio correct inside `object-contain` container. */
  lottieW: number;
  lottieH: number;
  /** Tailwind classes for CSS grid placement at each breakpoint. */
  gridClass: string;
  /** Background gradient (dark-tinted themed colour). */
  bg: string;
  /** Border colour. */
  border: string;
  /** Minimum block height (px) — reserves space, prevents layout shift. */
  minH: number;
}

const BLOCKS: Block[] = [
  {
    id: 'scene-2',
    src: '/lottie/explore-scene.json',
    caption: 'City energy',
    lottieW: 340,
    lottieH: 340,
    // 2 cols × 2 rows on lg; full width on md
    gridClass: 'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 md:col-span-2',
    bg: 'linear-gradient(145deg, rgba(46,107,255,0.20) 0%, rgba(46,107,255,0.07) 100%)',
    border: 'rgba(46,107,255,0.28)',
    minH: 200,
  },
  {
    id: 'fish',
    src: '/lottie/fish.json',
    caption: 'Out & about',
    lottieW: 200,
    lottieH: 200,
    // col 3, row 1 (square) on lg
    gridClass: 'lg:col-start-3 lg:row-start-1',
    bg: 'linear-gradient(145deg, rgba(255,178,62,0.20) 0%, rgba(255,178,62,0.07) 100%)',
    border: 'rgba(255,178,62,0.28)',
    minH: 200,
  },
  {
    id: 'scene-1',
    src: '/lottie/scene-1.json',
    caption: 'Calm moments',
    lottieW: 180,
    lottieH: 180,
    // col 4, row 1 (square) on lg
    gridClass: 'lg:col-start-4 lg:row-start-1',
    bg: 'linear-gradient(145deg, rgba(122,79,224,0.20) 0%, rgba(122,79,224,0.07) 100%)',
    border: 'rgba(122,79,224,0.28)',
    minH: 200,
  },
  {
    id: 'cat',
    src: '/lottie/cat.json',
    caption: 'Together always',
    lottieW: 420,
    lottieH: 220,
    // cols 3–4, row 2 (wide block) on lg; full width on md
    gridClass: 'lg:col-start-3 lg:col-span-2 lg:row-start-2 md:col-span-2',
    bg: 'linear-gradient(145deg, rgba(244,242,255,0.08) 0%, rgba(122,79,224,0.06) 100%)',
    border: 'rgba(244,242,255,0.14)',
    minH: 200,
  },
];

function MomentBlock({ block, delay = 0 }: { block: Block; delay?: number }) {
  return (
    <Reveal delay={delay} className={block.gridClass}>
      <motion.div
        whileHover={{ scale: 1.025, y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden flex items-center justify-center h-full w-full"
        style={{
          background: block.bg,
          border: `1.5px solid ${block.border}`,
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
          minHeight: block.minH,
        }}
      >
        {/* Subtle inner glow ring — decorative */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 65%)',
          }}
        />

        {/* Lottie centred with padding so it never touches edges */}
        <div className="relative flex items-center justify-center w-full h-full p-5">
          <LottiePlayer
            src={block.src}
            width={block.lottieW}
            height={block.lottieH}
            loop
          />
        </div>

        {/* Caption badge — accessible contrast on dark bg */}
        {block.caption && (
          <span
            className="absolute bottom-3 left-3 font-sans font-semibold text-xs px-2.5 py-1 rounded-full select-none"
            style={{
              background: 'rgba(20,18,42,0.72)',
              color: 'rgba(244,242,255,0.90)',
              letterSpacing: '0.04em',
              border: '1px solid rgba(244,242,255,0.10)',
            }}
          >
            {block.caption}
          </span>
        )}
      </motion.div>
    </Reveal>
  );
}

export function MomentsGrid() {
  return (
    /*
     * Wrapper stays inside PeopleSection's dark panel; mt/mb provide spacing
     * between the text copy above and the Marquee below.
     */
    <div className="max-w-7xl mx-auto px-6 mt-14 mb-4">
      {/*
       * CSS Grid:
       *   mobile  → 1 col
       *   md      → 2 cols, auto-rows
       *   lg      → 4 cols, 2 rows (scene-2 spans both rows in cols 1–2)
       *
       * gridAutoRows keeps md auto-flow blocks from collapsing to 0 height.
       */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ gridAutoRows: 'minmax(180px, auto)' }}
      >
        {BLOCKS.map((block, i) => (
          <MomentBlock key={block.id} block={block} delay={i * 0.06} />
        ))}
      </div>
    </div>
  );
}
