'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { Seal } from '@/components/ui/Seal';

interface FlowTopBarProps {
  /** Where the back/exit affordance goes. If omitted, uses router.back(). */
  backHref?: string;
  /** Label next to the back arrow, e.g. "Ananya's profile" or "Explore". */
  backLabel?: string;
  /** Show an X (exit) on the right that links to `exitHref`. */
  exitHref?: string;
  exitLabel?: string;
}

/**
 * FlowTopBar — minimal header for immersive flows (quiz, booking) that don't
 * use the full site Nav. Logo escapes to home; a back affordance returns to the
 * previous page; an optional exit X leaves the flow. Keeps these pages from
 * being dead-ends reachable only via the browser back button.
 */
export function FlowTopBar({ backHref, backLabel = 'Back', exitHref, exitLabel = 'Exit' }: FlowTopBarProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 w-full">
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3"
        style={{ background: 'rgba(251,252,255,0.82)', backdropFilter: 'blur(10px)' }}
      >
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 h-10 px-2.5 -ml-1 rounded-pill font-sans font-semibold text-sm transition-colors hover:bg-azure-tint focus-visible:outline-azure"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              // Guard the no-history case (direct load / new tab) so the user
              // isn't stranded; fall back to home.
              if (typeof window !== 'undefined' && window.history.length > 1) router.back();
              else router.push('/');
            }}
            className="inline-flex items-center gap-1.5 h-10 px-2.5 -ml-1 rounded-pill font-sans font-semibold text-sm transition-colors hover:bg-azure-tint focus-visible:outline-azure"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
        )}

        <Link
          href="/"
          aria-label="Companio home"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-azure"
        >
          <Seal size={26} decorative />
          <span className="font-display text-lg font-semibold tracking-tight" style={{ color: 'var(--color-ink)' }}>
            Companio
          </span>
        </Link>

        {exitHref ? (
          <Link
            href={exitHref}
            className="inline-flex items-center gap-1.5 h-10 px-2.5 -mr-1 rounded-pill font-sans font-semibold text-sm transition-colors hover:bg-azure-tint focus-visible:outline-azure"
            style={{ color: 'var(--color-ink-muted)' }}
            aria-label={exitLabel}
          >
            <span className="hidden sm:inline">{exitLabel}</span>
            <X size={17} aria-hidden="true" />
          </Link>
        ) : (
          <span className="w-10" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
