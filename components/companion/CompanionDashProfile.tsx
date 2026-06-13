'use client';

import { useState, useId, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { calm } from '@/lib/motion';

const ALL_ACTIVITIES = ['City Walk', 'Café Chat', 'Gym Buddy', 'Live Events', 'Elder Company', 'Museum Visit'];
const RATE_MIN = 299;
const RATE_MAX = 999;

export function CompanionDashProfile() {
  const sliderId = useId();
  const [rate, setRate] = useState(499);
  const [activities, setActivities] = useState(['City Walk', 'Café Chat', 'Live Events']);
  const [toast, setToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fillPct = ((rate - RATE_MIN) / (RATE_MAX - RATE_MIN)) * 100;

  const toggleActivity = (a: string) => {
    setActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const save = () => {
    setToast(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(false), 2500);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <section
      aria-labelledby="profile-editor-heading"
      className="rounded-2xl p-5 relative"
      style={{
        background: 'var(--color-surface)',
        border: '1.5px solid rgba(46,107,255,0.1)',
        boxShadow: 'var(--shadow-1)',
      }}
    >
      <h2
        id="profile-editor-heading"
        className="font-sans font-bold text-base mb-5"
        style={{ color: 'var(--color-ink)' }}
      >
        Quick profile edit
      </h2>

      {/* Rate slider */}
      <div className="mb-5">
        <label htmlFor={sliderId} className="font-sans text-sm font-semibold block mb-1" style={{ color: 'var(--color-ink)' }}>
          Rate per meetup: <span style={{ color: 'var(--color-azure)' }}>₹{rate}</span>
        </label>
        <div className="relative h-5 flex items-center mt-2">
          <div className="absolute inset-x-0 h-2 rounded-pill"
            style={{ top: '50%', transform: 'translateY(-50%)', background: 'rgba(46,107,255,0.12)' }} />
          <div className="absolute h-2 rounded-pill"
            style={{ left: 0, top: '50%', transform: 'translateY(-50%)', width: `${fillPct}%`, background: 'var(--grad-aurora)', transition: 'width 0.1s ease' }} />
          <input
            id={sliderId}
            type="range"
            min={RATE_MIN} max={RATE_MAX} step={50}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            aria-valuetext={`₹${rate} per meetup`}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div aria-hidden="true" className="absolute w-5 h-5 rounded-full pointer-events-none"
            style={{ left: `calc(${fillPct}% - ${(fillPct / 100) * 20}px)`, top: '50%', transform: 'translateY(-50%)', background: 'var(--color-azure)', boxShadow: 'var(--glow-azure)', transition: 'left 0.1s ease' }} />
        </div>
      </div>

      {/* Activities */}
      <div className="mb-5">
        <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Activities</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Activities">
          {ALL_ACTIVITIES.map((a) => {
            const on = activities.includes(a);
            return (
              <button
                key={a}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggleActivity(a)}
                className="h-9 px-3.5 rounded-pill font-sans text-xs font-medium transition-colors focus-visible:outline-2"
                style={{
                  background: on ? 'rgba(46,107,255,0.1)' : 'rgba(46,107,255,0.04)',
                  border: `1.5px solid ${on ? 'var(--color-azure)' : 'rgba(46,107,255,0.15)'}`,
                  color: on ? 'var(--color-azure-deep)' : 'var(--color-ink-muted)',
                  minHeight: 44,
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <Button variant="cta" size="md" onClick={save}>Save changes</Button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            className="absolute bottom-4 right-4 px-4 py-2 rounded-xl font-sans text-xs font-semibold"
            style={{ background: 'var(--color-ink)', color: 'var(--color-panel-text)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={calm.base}
          >
            Changes saved
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
