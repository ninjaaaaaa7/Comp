'use client';

import { Search, X, Zap, LayoutGrid, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Availability, SortKey } from './useExploreFilters';
import { ALL_ACTIVITIES } from './useExploreFilters';

export type ViewMode = 'grid' | 'map';

interface ExploreFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activityFilters: string[];
  onToggleActivity: (act: string) => void;
  availability: Availability;
  onAvailabilityChange: (v: Availability) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  freeNowOnly: boolean;
  onFreeNowToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

const AVAIL_OPTIONS: { value: Availability; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'evenings', label: 'Evenings' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'best_match', label: 'Best match' },
  { value: 'top_rated', label: 'Top rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'most_reviewed', label: 'Most reviewed' },
  { value: 'price', label: 'Price' },
];

const pillBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  border: '1.5px solid rgba(46,107,255,0.18)',
  color: 'var(--color-ink)',
  outlineColor: 'var(--color-azure)',
};

/**
 * ExploreFilters — search + activity chips + availability + sort + free-now + view toggle.
 * All filter state lives in ExploreClient (via useExploreFilters).
 */
export function ExploreFilters({
  searchQuery, onSearchChange,
  activityFilters, onToggleActivity,
  availability, onAvailabilityChange,
  sort, onSortChange,
  freeNowOnly, onFreeNowToggle,
  viewMode, onViewModeChange,
  isFiltered, onClearFilters,
}: ExploreFiltersProps) {
  return (
    <div
      className="py-4 border-b"
      style={{ borderColor: 'rgba(46,107,255,0.10)', background: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-3">

        {/* Row 1 — search + selects + free-now + view toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-ink-muted)' }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Name or activity…"
              aria-label="Search companions by name or activity"
              className="w-full h-10 rounded-pill pl-8 pr-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
              style={pillBase}
            />
          </div>

          {/* Availability */}
          <select
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value as Availability)}
            aria-label="Filter by availability"
            className="h-10 rounded-pill px-3 text-sm appearance-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            style={pillBase}
          >
            {AVAIL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="Sort companions"
            className="h-10 rounded-pill px-3 text-sm appearance-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            style={pillBase}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Free now toggle */}
          <button
            type="button"
            aria-pressed={freeNowOnly}
            onClick={onFreeNowToggle}
            className={cn(
              'flex items-center gap-1.5 h-10 px-3 rounded-pill text-sm font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
            )}
            style={
              freeNowOnly
                ? {
                    background: 'var(--color-emerald)',
                    border: '1.5px solid var(--color-emerald)',
                    color: 'white',
                    outlineColor: 'var(--color-emerald)',
                  }
                : {
                    ...pillBase,
                    color: 'var(--color-ink-muted)',
                  }
            }
          >
            <Zap size={13} aria-hidden="true" />
            Free now
          </button>

          {/* Grid / Map segmented control */}
          <div
            className="flex items-center rounded-pill p-0.5 gap-0.5"
            style={pillBase}
            role="group"
            aria-label="Switch view"
          >
            {(['grid', 'map'] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={viewMode === m}
                onClick={() => onViewModeChange(m)}
                className={cn(
                  'flex items-center gap-1 h-8 px-2.5 rounded-pill text-xs font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
                )}
                style={
                  viewMode === m
                    ? {
                        background: 'var(--color-azure)',
                        color: 'white',
                        outlineColor: 'var(--color-azure)',
                      }
                    : { color: 'var(--color-ink-muted)', outlineColor: 'var(--color-azure)' }
                }
              >
                {m === 'grid' ? <LayoutGrid size={12} aria-hidden /> : <Map size={12} aria-hidden />}
                {m === 'grid' ? 'Grid' : 'Map'}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1 h-10 px-3 rounded-pill text-sm font-medium transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{ color: 'var(--color-ink-muted)', outlineColor: 'var(--color-azure)' }}
            >
              <X size={13} aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Row 2 — activity chips */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by activity">
          {ALL_ACTIVITIES.map((act) => {
            const active = activityFilters.includes(act);
            return (
              <button
                key={act}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleActivity(act)}
                className={cn(
                  'rounded-pill px-3 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
                  !active && 'hover:bg-white/80',
                )}
                style={
                  active
                    ? {
                        background: 'var(--color-azure)',
                        border: '1.5px solid var(--color-azure)',
                        color: 'white',
                        outlineColor: 'var(--color-azure)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.60)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1.5px solid rgba(46,107,255,0.18)',
                        color: 'var(--color-ink-muted)',
                        outlineColor: 'var(--color-azure)',
                      }
                }
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
