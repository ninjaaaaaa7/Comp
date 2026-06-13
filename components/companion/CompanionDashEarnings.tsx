'use client';

import { CountUp } from '@/components/motion/CountUp';
import { calm } from '@/lib/motion';

const CARDS = [
  { label: 'Today', value: 0, prefix: '₹' },
  { label: 'This week', value: 1996, prefix: '₹' },
  { label: 'This month', value: 7485, prefix: '₹' },
] as const;

export function CompanionDashEarnings() {
  return (
    <section aria-labelledby="earnings-heading">
      <h2
        id="earnings-heading"
        className="font-sans font-bold text-base mb-4"
        style={{ color: 'var(--color-ink)' }}
      >
        Earnings
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl p-5"
            style={{
              background: 'var(--color-surface)',
              border: '1.5px solid rgba(46,107,255,0.1)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <p className="font-sans text-xs font-medium mb-2" style={{ color: 'var(--color-ink-muted)' }}>
              {c.label}
            </p>
            <p
              className="font-display font-bold leading-none"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: 'var(--color-ink)' }}
            >
              {c.prefix}
              <CountUp
                value={c.value}
                duration={calm.slow.duration as number}
                className="tabular-nums"
              />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
