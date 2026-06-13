'use client';

import { motion, type Variants } from 'framer-motion';

/**
 * Page-level transition wrapper.
 * Wire into app/layout.tsx once route-level animation is needed (Stage 2b+).
 *
 * Out: scale .98, opacity 0, ease-exit
 * In:  scale 1,   opacity 1, ease-enter
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  enter:   {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: [0.16, 1, 0.30, 1], // --ease-enter
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.18,
      ease: [0.7, 0, 0.84, 0], // --ease-exit
    },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
