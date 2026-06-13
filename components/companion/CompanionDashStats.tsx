'use client';

import { Eye, MessageCircle, Star } from 'lucide-react';
import { CountUp } from '@/components/motion/CountUp';
import { calm } from '@/lib/motion';

const STATS = [
  { icon: Eye, label: 'Profile views', value: 320, suffix: '' },
  { icon: MessageCircle, label: 'Response rate', value: 98, suffix: '%' },
] as const;

export function CompanionDashStats() {
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Performance stats</h2>
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl p-5 flex flex-col items-center text-center"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid rgba(46,107,255,0.1)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <Icon size={18} style={{ color: 'var(--color-azure)' }} className="mb-2" aria-hidden="true" />
              <p
                className="font-display font-bold leading-none mb-1"
                style={{ fontSize: '1.75rem', color: 'var(--color-ink)' }}
                aria-label={`${s.value}${s.suffix} ${s.label}`}
              >
                <CountUp
                  value={s.value}
                  suffix={s.suffix}
                  duration={calm.slow.duration as number}
                  className="tabular-nums"
                />
              </p>
              <p className="font-sans text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                {s.label}
              </p>
            </div>
          );
        })}

        {/* Rating — static since 4.9 would show as 5 with CountUp rounding */}
        <div
          className="rounded-2xl p-5 flex flex-col items-center text-center"
          style={{
            background: 'var(--color-surface)',
            border: '1.5px solid rgba(46,107,255,0.1)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <Star size={18} style={{ color: 'var(--color-gold)' }} className="mb-2" fill="var(--color-gold)" aria-hidden="true" />
          <p
            className="font-display font-bold leading-none mb-1"
            style={{ fontSize: '1.75rem', color: 'var(--color-ink)' }}
            aria-label="4.9 average rating"
          >
            4.9<span style={{ color: 'var(--color-gold)' }}>★</span>
          </p>
          <p className="font-sans text-xs" style={{ color: 'var(--color-ink-muted)' }}>
            Avg rating
          </p>
        </div>
      </div>
    </section>
  );
}
