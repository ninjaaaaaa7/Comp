'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '@/components/motion/PageTransition';

/**
 * Route-level transition (spec §8.3): every navigation gets the calm
 * enter fade. Next remounts template.tsx per navigation, so `initial`
 * plays on each route change. Lenis still owns scroll (template only
 * wraps content). Reduced motion: content renders in place.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter">
      {children}
    </motion.div>
  );
}
