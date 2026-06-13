'use client';

import { ChevronDown } from 'lucide-react';
import { CITIES } from '@/lib/data/cities';

interface CitySelectorProps {
  value: string;
  onChange: (id: string) => void;
}

/**
 * CitySelector — styled frosted-pill <select> for the explore header.
 * Purely display-only re-skin; profiles/photos stay the same (spec §ADD item 2).
 */
export function CitySelector({ value, onChange }: CitySelectorProps) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select city"
        className="appearance-none cursor-pointer rounded-pill pl-3 pr-8 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(46,107,255,0.22)',
          color: 'var(--color-ink)',
          outlineColor: 'var(--color-azure)',
          boxShadow: 'var(--shadow-1)',
        }}
      >
        {CITIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5"
        style={{ color: 'var(--color-ink-muted)' }}
      />
    </div>
  );
}
