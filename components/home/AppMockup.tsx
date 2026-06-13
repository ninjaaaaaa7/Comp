'use client';

import { BadgeCheck, MapPin, Star, Search, SlidersHorizontal } from 'lucide-react';

/** Companion data shown inside the phone mockup — placeholder, platonic only */
const COMPANIONS = [
  {
    name: 'Priya S.',
    city: 'Mumbai',
    activities: ['City Walk', 'Museum', 'Café'],
    rate: '₹800/hr',
    rating: 4.9,
    reviews: 124,
    initials: 'PS',
    accent: '#2E6BFF',
    bg: '#EBF1FF',
  },
  {
    name: 'Arjun K.',
    city: 'Bengaluru',
    activities: ['Gym', 'Hiking', 'Events'],
    rate: '₹700/hr',
    rating: 4.8,
    reviews: 87,
    initials: 'AK',
    accent: '#7A4FE0',
    bg: '#F0EBFF',
  },
] as const;

function CompanionCard({ c }: { c: (typeof COMPANIONS)[number] }) {
  return (
    <div
      className="rounded-2xl p-3 mx-3 mb-3"
      style={{
        background: '#fff',
        border: '1px solid rgba(20,26,46,0.07)',
        boxShadow: '0 4px 16px -6px rgba(20,26,46,0.1)',
      }}
    >
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 font-sans font-bold text-sm text-white"
          style={{ background: c.accent }}
        >
          {c.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <p className="font-sans font-bold text-sm leading-tight" style={{ color: 'var(--color-ink)' }}>
              {c.name}
            </p>
            <BadgeCheck size={13} style={{ color: 'var(--color-emerald)' }} aria-label="Verified" />
          </div>
          <p className="font-sans text-xs flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
            <MapPin size={10} aria-hidden="true" />
            {c.city}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-sans font-bold text-xs" style={{ color: 'var(--color-azure)' }}>
            {c.rate}
          </p>
          <p className="font-sans text-xs flex items-center gap-0.5 justify-end mt-0.5" style={{ color: 'var(--color-gold)' }}>
            <Star size={9} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            {c.rating}
            <span style={{ color: 'var(--color-ink-muted)' }}>({c.reviews})</span>
          </p>
        </div>
      </div>

      {/* Activity tags */}
      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        {c.activities.map((a) => (
          <span
            key={a}
            className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-pill"
            style={{ background: c.bg, color: c.accent }}
          >
            {a}
          </span>
        ))}
      </div>

      {/* Book button */}
      <button
        aria-label={`Book session with ${c.name}`}
        className="mt-3 w-full py-1.5 rounded-xl font-sans font-bold text-xs text-white transition-opacity hover:opacity-90"
        style={{ background: 'var(--grad-cta)' }}
      >
        Book a session
      </button>
    </div>
  );
}

/**
 * Tasteful product UI mockup — phone frame showing the companion browse screen.
 * Pure DOM/CSS, no images. Dimensions: 272×540.
 */
export function AppMockup() {
  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden shrink-0"
      style={{
        width: 272,
        height: 540,
        background: '#F7F8FC',
        border: '7px solid #141A2E',
        boxShadow:
          '0 0 0 1px rgba(46,107,255,0.25), 0 40px 80px -20px rgba(20,18,42,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-5 py-2"
        style={{ background: '#fff', borderBottom: '1px solid rgba(20,26,46,0.06)' }}
        aria-hidden="true"
      >
        <span className="font-sans font-semibold text-[10px]" style={{ color: 'var(--color-ink)' }}>9:41</span>
        <div className="flex gap-1 items-center">
          {[14, 10, 6].map((h, i) => (
            <div key={i} className="w-1 rounded-sm" style={{ height: h, background: 'var(--color-ink)' }} />
          ))}
          <div className="ml-1 w-5 h-2.5 rounded-sm border" style={{ borderColor: 'var(--color-ink)' }}>
            <div className="h-full w-[80%] rounded-sm" style={{ background: 'var(--color-emerald)' }} />
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: '#fff' }}>
        <p className="font-display font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
          Browse Companions
        </p>
        <SlidersHorizontal size={15} style={{ color: 'var(--color-azure)' }} aria-hidden="true" />
      </div>

      {/* Search bar */}
      <div className="mx-3 mb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: '#fff', border: '1px solid rgba(46,107,255,0.18)' }}
        >
          <Search size={13} style={{ color: 'var(--color-azure)' }} aria-hidden="true" />
          <span className="font-sans text-xs" style={{ color: 'var(--color-ink-muted)' }}>
            City, activity, name…
          </span>
        </div>
      </div>

      {/* Section label */}
      <p className="px-4 mb-2 font-sans font-bold text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-azure)' }}>
        Available now
      </p>

      {/* Companion cards */}
      {COMPANIONS.map((c) => (
        <CompanionCard key={c.name} c={c} />
      ))}

      {/* Bottom fade — simulates more content below */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #F7F8FC 0%, transparent 100%)' }}
      />
    </div>
  );
}
