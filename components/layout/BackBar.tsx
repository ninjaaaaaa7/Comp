'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackBarProps {
  /** Explicit destination. If omitted, goes to the previous page. */
  backHref?: string;
  /** Label next to the arrow, e.g. "Explore" or "Back". */
  label?: string;
  /** Where router.back() lands when there's no history (direct load / new tab). */
  fallbackHref?: string;
}

const BTN_CLASS =
  'inline-flex items-center gap-1.5 h-9 px-3 -ml-1 rounded-pill font-sans font-semibold ' +
  'text-sm transition-colors hover:bg-azure-tint focus-visible:outline-azure';

/**
 * BackBar — a consistent "way back" affordance for pages that use the global
 * Nav (info pages, dashboard, pricing, profile, auth). Sits just under the
 * sticky Nav (top-16) so it stays reachable while scrolling.
 *
 * Without backHref it calls router.back(), but guards the no-history case
 * (page opened in a new tab / loaded directly) by routing to fallbackHref
 * instead of leaving the user stranded — the gap FlowTopBar had.
 */
export function BackBar({ backHref, label = 'Back', fallbackHref = '/' }: BackBarProps) {
  const router = useRouter();

  const inner = (
    <>
      <ArrowLeft size={17} aria-hidden="true" />
      <span>{label}</span>
    </>
  );

  return (
    <div
      className="sticky top-16 z-40 w-full"
      style={{ background: 'rgba(251,252,255,0.82)', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center">
        {backHref ? (
          <Link href={backHref} className={BTN_CLASS} style={{ color: 'var(--color-ink-muted)' }}>
            {inner}
          </Link>
        ) : (
          <button
            type="button"
            className={BTN_CLASS}
            style={{ color: 'var(--color-ink-muted)' }}
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) router.back();
              else router.push(fallbackHref);
            }}
          >
            {inner}
          </button>
        )}
      </div>
    </div>
  );
}
