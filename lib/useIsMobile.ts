'use client';

import { useEffect, useState } from 'react';

/**
 * True below the md breakpoint (768px). Returns false during SSR and the
 * first client paint (desktop-first default — avoids hydration mismatch).
 *
 * Used to swap heavy scroll-driven scenes (sticky phone hero, horizontal
 * activity chapter) for simple static/stacked layouts on small screens,
 * where they would clip and jank.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return isMobile;
}
