'use client';

import { Unlock, Calendar, Star, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Stamp } from '@/components/ui/Stamp';
import type { Booking } from '@/lib/appState';

interface StampShelfProps {
  bookings: Booking[];
  unlocked: boolean;
}

interface MilestoneDef {
  key: string;
  label: string;
  icon: LucideIcon;
  earned: boolean;
  angle: number;
  delay: number;
}

export function StampShelf({ bookings, unlocked }: StampShelfProps) {
  const hasBooking = bookings.some(
    (b) => b.status === 'upcoming' || b.status === 'completed',
  );
  const hasReview = bookings.some((b) => !!b.review);

  const milestones: MilestoneDef[] = [
    { key: 'verified',     label: 'Verified member',      icon: ShieldCheck, earned: true,       angle:  2,    delay: 0    },
    { key: 'profiles',     label: 'Profiles unlocked',    icon: Unlock,      earned: unlocked,   angle: -2,    delay: 0.06 },
    { key: 'first-meetup', label: 'First meetup booked',  icon: Calendar,    earned: hasBooking, angle:  1.5,  delay: 0.12 },
    { key: 'first-review', label: 'First review',         icon: Star,        earned: hasReview,  angle: -1.5,  delay: 0.18 },
  ];

  // Parent OverviewPanel stagger wrapper handles the card entrance animation
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-1)',
        border: '1.5px solid rgba(46,107,255,0.08)',
      }}
    >
      <p
        className="font-sans text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ color: 'var(--color-ink-muted)' }}
      >
        Your milestones
      </p>
      <ul className="flex flex-wrap gap-4" aria-label="Your milestones">
        {milestones.map(({ key, label, icon, earned, angle, delay }) => (
          <li key={key}>
            {earned ? (
              <Stamp icon={icon} label={label} tone="trust" angle={angle} transitionDelay={delay} />
            ) : (
              <FutureSlot icon={icon} label={label} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FutureSlot({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div
      className="inline-flex flex-col items-center gap-1.5 border-2 rounded-lg px-3 py-2.5"
      style={{ borderColor: 'rgba(90,99,120,0.18)', color: 'rgba(90,99,120,0.35)' }}
      aria-label={`Future milestone: ${label}`}
      role="img"
    >
      <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
      <span className="font-sans font-bold text-xs tracking-widest uppercase leading-none text-center">
        {label}
      </span>
    </div>
  );
}
