'use client';

import { Sparkles, Pause } from 'lucide-react';
import { useMotionPreference } from '@/lib/motionPreference';

/**
 * Floating control to force animations on/off, overriding the OS
 * prefers-reduced-motion setting. Sits bottom-left, above the mobile tab bar.
 */
export function MotionToggle() {
  const { forceMotion, toggle, mounted } = useMotionPreference();
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={forceMotion}
      aria-label={forceMotion ? 'Turn animations off' : 'Turn animations on'}
      className="fixed left-4 bottom-20 md:bottom-4 z-[60] inline-flex items-center gap-2 h-10 px-4 rounded-pill font-sans font-semibold text-xs transition-colors focus-visible:outline-azure"
      style={{
        background: forceMotion ? 'var(--grad-cta)' : 'var(--color-surface)',
        color: forceMotion ? '#fff' : 'var(--color-ink-muted)',
        border: forceMotion ? 'none' : '1px solid rgba(20,26,46,0.12)',
        boxShadow: 'var(--shadow-2)',
      }}
    >
      {forceMotion ? <Sparkles size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      {forceMotion ? 'Animations on' : 'Animations off'}
    </button>
  );
}
