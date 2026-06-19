'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Heart, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { durations } from '@/lib/motion';
import type { Companion } from '@/lib/data/companions';

/*
 * Pulse-ring keyframe — injected once per page load, not once per card.
 * The keyframe is now in globals.css so this component adds zero <style> tags.
 * (companio-pulse-ring is defined in app/globals.css via the shared keyframes block)
 */

// Deterministic "viewed today" mock counts — no Math.random at render.
const VIEWS_TODAY: Record<string, number> = {
  ananya: 47, priya: 38, deepika: 33, zara: 29, meena: 26,
  rohan: 21, kiran: 19, aarav: 18, ishaan: 16, fatima: 15,
  vivek: 14, sahil: 12, arjun: 11, nisha: 8,
};

/** "New this week" — reviews < 45 */
function isNew(c: Companion) { return c.reviews < 45; }
/** "Popular" — reviews > 100 */
function isPopular(c: Companion) { return c.reviews > 100; }

interface CompanionCardProps {
  companion: Companion;
  develop?: { delay: number; ring?: boolean } | null;
  onBook?: (c: Companion) => void;
  /** Favourite state — only provided when grid is unlocked. */
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  /** Compare state — only provided when grid is unlocked. */
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
  /** Show matchScore badge when quizDone. */
  quizDone?: boolean;
}

function Chip({
  children, className, style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-xs font-medium bg-white/90 text-ink',
        className,
      )}
      style={{ border: '1.5px solid rgba(46,107,255,0.2)', ...style }}
    >
      {children}
    </span>
  );
}

// memo: prevents re-render when parent (CompanionGrid/ExploreClient) state changes
// but this card's own props haven't changed. Handlers from ExploreClient are already
// wrapped in useCallback so reference stability is maintained.
export const CompanionCard = memo(function CompanionCard({
  companion, develop, onBook,
  isFavorite, onToggleFavorite,
  isCompared, onToggleCompare,
  quizDone,
}: CompanionCardProps) {
  const shouldReduce = useReducedMotion();
  const { id, name, city, area, rating, reviews, activities, photo, topMatch } = companion;

  const ease = [0.16, 1, 0.3, 1] as const;
  const hasDevelop = !!(develop && !shouldReduce);
  const hasRing = !!(develop?.ring && !shouldReduce);

  // Cards in the unlocked grid always have onToggleFavorite; locked preview cards don't.
  const isUnlockedGrid = !!onToggleFavorite;

  return (
    <motion.article
      className="relative w-full rounded-[var(--radius-lg)] overflow-hidden bg-surface"
      style={{ boxShadow: 'var(--shadow-1)' }}
      initial={hasRing ? { boxShadow: '0 0 0 1px rgba(255,178,62,0.25), 0 12px 36px -12px rgba(255,178,62,0.45)' } : false}
      animate={hasRing ? { boxShadow: '0 1px 3px rgba(20,26,46,0.07)' } : {}}
      transition={hasRing ? { duration: 0.9, ease, delay: develop!.delay } : {}}
    >
      {/* Portrait — 4:3 compact */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <motion.div
          className="absolute inset-0"
          initial={hasDevelop ? { filter: 'blur(18px) sepia(0.6)', scale: 1 } : false}
          animate={hasDevelop ? { filter: 'blur(0px) sepia(0)', scale: [1, 1.04, 1] } : {}}
          transition={hasDevelop ? { duration: durations.slow, ease, delay: develop!.delay } : {}}
        >
          <Image
            src={photo}
            alt={`${name}, companion in ${area}, ${city}`}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
            className="object-cover"
          />
        </motion.div>

        {/* Top-left overlay: topMatch ribbon OR New/Popular badge */}
        {topMatch ? (
          <div
            className="absolute top-2 left-2 px-2.5 py-1 rounded-pill text-xs font-semibold text-ink"
            style={{ background: 'var(--color-gold)' }}
          >
            Top match
          </div>
        ) : isUnlockedGrid && (isNew(companion) || isPopular(companion)) ? (
          <div
            className="absolute top-2 left-2 px-2.5 py-1 rounded-pill text-xs font-semibold"
            style={
              isNew(companion)
                ? { background: '#7A4FE0', color: '#fff' }
                : { background: '#FFB23E', color: '#141A2E' }
            }
          >
            {isNew(companion) ? 'New this week' : 'Popular'}
          </div>
        ) : null}

        {/* Favourite toggle */}
        {onToggleFavorite && (
          <button
            type="button"
            aria-pressed={!!isFavorite}
            aria-label={isFavorite ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
            className={cn(
              'absolute top-2 right-2 w-11 h-11 flex items-center justify-center rounded-full transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
              isFavorite ? 'bg-white/90' : 'bg-black/25 hover:bg-white/80',
            )}
            style={{ outlineColor: 'var(--color-azure)' }}
          >
            <Heart
              size={18}
              aria-hidden="true"
              className={isFavorite ? 'fill-current' : ''}
              style={{ color: isFavorite ? '#E53E3E' : 'white' }}
            />
          </button>
        )}


        {/* Availability pill — unlocked grid only */}
        {isUnlockedGrid && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            {companion.availableNow && (
              /* Live presence pulse: layered rings for "Free now" companions */
              <span className="relative inline-flex shrink-0" aria-hidden="true">
                {!shouldReduce && (
                  <>
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'var(--color-emerald)',
                        opacity: 0.35,
                        animation: 'companio-pulse-ring 1.8s ease-out infinite',
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'var(--color-emerald)',
                        opacity: 0.2,
                        animation: 'companio-pulse-ring 1.8s ease-out 0.6s infinite',
                      }}
                    />
                  </>
                )}
                <span
                  className="relative block h-2.5 w-2.5 rounded-full"
                  style={{ background: 'var(--color-emerald)' }}
                />
              </span>
            )}
            {!companion.availableNow && (
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: 'rgba(90,99,120,0.4)' }}
                aria-hidden="true"
              />
            )}
            <span
              className="px-2 py-0.5 rounded-pill text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: companion.availableNow
                  ? '1px solid rgba(31,174,107,0.35)'
                  : '1px solid rgba(46,107,255,0.18)',
                color: companion.availableNow ? 'var(--color-emerald)' : 'var(--color-ink-muted)',
              }}
            >
              {companion.availability}
            </span>
          </div>
        )}

        {/* companio-pulse-ring keyframe lives in globals.css — no per-card <style> injection */}
      </div>

      {/* Card info */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold text-ink leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </span>
          <BadgeCheck size={16} className="text-azure shrink-0" aria-hidden="true" />
          <span className="sr-only">Verified</span>
          {/* Distance */}
          {isUnlockedGrid && (
            <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--color-ink-muted)' }}>
              {companion.distanceKm} km
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip>{area} · {city}</Chip>
          <Chip>★ {rating} ({reviews})</Chip>
          {/* Match score badge — shown when quizDone */}
          {quizDone && isUnlockedGrid && (
            <Chip
              className="font-semibold"
              style={{
                background: 'rgba(122,79,224,0.12)',
                border: '1.5px solid rgba(122,79,224,0.25)',
                color: 'var(--color-violet)',
              } as React.CSSProperties}
            >
              {companion.matchScore}% match
            </Chip>
          )}
          {isUnlockedGrid && VIEWS_TODAY[companion.id] !== undefined && (
            <Chip style={{ color: 'var(--color-ink-muted)' }}>
              👁 {VIEWS_TODAY[companion.id]} today
            </Chip>
          )}
          {activities.slice(0, 2).map((act) => (
            <Chip key={act}>{act}</Chip>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 gap-2">
          <Link
            href={`/companion/${id}`}
            className={cn(
              'text-xs text-azure-deep underline underline-offset-2 hover:text-azure',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure rounded-sm',
            )}
          >
            View profile
          </Link>

          {/* Compare toggle — unlocked grid only */}
          {onToggleCompare && (
            <button
              type="button"
              aria-pressed={!!isCompared}
              aria-label={isCompared ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
              onClick={(e) => { e.stopPropagation(); onToggleCompare(id); }}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-pill text-xs font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
              )}
              style={
                isCompared
                  ? {
                      background: 'var(--color-azure)',
                      border: '1.5px solid var(--color-azure)',
                      color: 'white',
                      outlineColor: 'var(--color-azure)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.70)',
                      border: '1.5px solid rgba(46,107,255,0.20)',
                      color: 'var(--color-ink-muted)',
                      outlineColor: 'var(--color-azure)',
                    }
              }
            >
              {isCompared ? <Check size={11} aria-hidden /> : <Plus size={11} aria-hidden />}
              {isCompared ? 'Added' : 'Compare'}
            </button>
          )}

          <button
            type="button"
            onClick={() => onBook?.(companion)}
            className={cn(
              'min-h-[44px] px-4 py-2 rounded-pill text-sm font-semibold text-white',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            )}
            style={{ background: 'var(--grad-cta)', boxShadow: 'var(--glow-azure)' }}
            aria-label={`Book a walk with ${name}`}
          >
            Book a walk
          </button>
        </div>
      </div>
    </motion.article>
  );
});
