'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { RevealGroup, Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import { spring, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Review {
  name: string;
  city: string;
  stars: number;
  text: string;
}

interface Props {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

/**
 * Plain star row used inside review cards (already inside Reveal, no extra animation).
 * Header variant passes `animated` to stagger-fill stars on mount.
 */
function StarRow({
  rating,
  size = 14,
  animated = false,
}: {
  rating: number;
  size?: number;
  animated?: boolean;
}) {
  const reduced = useReducedMotion();
  const path = 'M8 1.5l1.85 3.74 4.12.6-2.98 2.9.7 4.1L8 10.8l-3.69 1.94.7-4.1L2.03 5.84l4.12-.6L8 1.5z';

  return (
    <span aria-label={`${rating} out of 5 stars`} className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        if (animated) {
          return (
            <motion.svg
              key={i}
              aria-hidden="true"
              width={size}
              height={size}
              viewBox="0 0 16 16"
              fill={filled ? 'var(--color-gold)' : 'var(--color-edge)'}
              initial={reduced ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { ...spring.snappy, delay: i * stagger.tight }
              }
            >
              <path d={path} />
            </motion.svg>
          );
        }
        return (
          <svg
            key={i}
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill={filled ? 'var(--color-gold)' : 'var(--color-edge)'}
          >
            <path d={path} />
          </svg>
        );
      })}
    </span>
  );
}

export function CompanionProfileReviews({ reviews, rating, reviewCount }: Props) {
  return (
    <section aria-label="Member reviews">
      <div className="flex items-center gap-3 mb-5">
        <h2
          className="font-sans font-bold text-sm uppercase tracking-widest"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          Reviews
        </h2>
        <span className="flex items-center gap-1.5">
          <StarRow rating={Math.round(rating)} size={15} animated />
          <span
            className="font-sans font-semibold text-sm"
            style={{ color: 'var(--color-ink)' }}
          >
            {rating.toFixed(1)}
          </span>
          <span className="font-sans text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            ({reviewCount} reviews)
          </span>
        </span>
      </div>

      <RevealGroup>
        <ul className="space-y-4" role="list">
          {reviews.map((r) => (
            <Reveal key={`${r.name}-${r.stars}`}>
              <li>
                {/* TiltCard wraps the visual card; li stays a clean list item */}
                <TiltCard maxDeg={4}>
                  <div
                    className={cn(
                      'rounded-lg p-4',
                      r.stars === 4
                        ? 'border border-[--color-edge] bg-[--color-surface]'
                        : 'bg-[--color-azure-tint]',
                    )}
                    style={{ boxShadow: 'var(--shadow-1)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StarRow rating={r.stars} />
                        {r.stars === 4 && (
                          <span
                            className="font-sans text-xs px-2 py-0.5 rounded-pill border"
                            style={{
                              color: 'var(--color-ink-muted)',
                              borderColor: 'var(--color-edge)',
                              background: 'var(--color-surface)',
                            }}
                          >
                            Honest review
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                        {r.name} · {r.city}
                      </span>
                    </div>
                    <p
                      className="font-serif text-sm leading-relaxed"
                      style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-serif)' }}
                    >
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                </TiltCard>
              </li>
            </Reveal>
          ))}
        </ul>
      </RevealGroup>
    </section>
  );
}
