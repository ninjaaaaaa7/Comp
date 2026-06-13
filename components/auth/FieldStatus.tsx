'use client';

import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { spring } from '@/lib/motion';

/** Pops in an emerald check (spring.snappy) when `valid` flips true. Place inside a flex label row. */
export function FieldStatus({ valid, reduced }: { valid: boolean; reduced: boolean }) {
  return (
    <AnimatePresence>
      {valid && (
        <motion.span
          key="ok"
          aria-hidden="true"
          className="inline-flex items-center ml-1"
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={spring.snappy}
          style={{ color: '#157A4A' }}
        >
          <Check size={13} strokeWidth={2.5} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * Wraps a field block with a one-shot horizontal shake each time `shakeKey`
 * increments. Under reduced motion, no shake — error border-color is enough.
 */
export function ShakeWrapper({
  shakeKey,
  reduced,
  children,
}: {
  shakeKey: number;
  reduced: boolean;
  children: ReactNode;
}) {
  const [scope, animate] = useAnimate();
  const prev = useRef(0);

  useEffect(() => {
    if (shakeKey > 0 && shakeKey !== prev.current) {
      prev.current = shakeKey;
      if (!reduced) void animate(scope.current, { x: [-4, 4, -3, 3, 0] }, spring.snappy);
    }
  }, [shakeKey, reduced, animate, scope]);

  return <motion.div ref={scope}>{children}</motion.div>;
}
