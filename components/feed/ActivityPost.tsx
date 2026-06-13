import { Users } from 'lucide-react';
import type { ActivityPost as ActivityPostData } from './data';

interface Props {
  post: ActivityPostData;
}

// Maps well-known activity tags to theme accent colours.
const TAG_PALETTE: Record<string, string> = {
  'Morning Run':       '#1FAE6B',
  'City Walk':         '#2E6BFF',
  'Museum':            '#7A4FE0',
  'Café Chat':         '#FFB23E',
  'Book Browsing':     '#7A4FE0',
  'Street Food Tour':  '#FFB23E',
  'Live Events':       '#2E6BFF',
  'Photography Walk':  '#7A4FE0',
  'Yoga':              '#1FAE6B',
  'Gym Buddy':         '#1FAE6B',
};
const tagColor = (tag: string) => TAG_PALETTE[tag] ?? '#5A6378';

export function ActivityPost({ post }: Props) {
  const color = tagColor(post.activityTag);

  return (
    <div className="flex flex-col gap-3">
      {/* Tag + spots badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold"
          style={{
            background: `${color}1A`,
            color,
            border: `1.5px solid ${color}33`,
          }}
        >
          {post.activityTag}
        </span>
        {post.spotsLeft !== undefined && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-pill"
            style={{
              background: 'rgba(255,178,62,0.12)',
              color: 'var(--color-gold)',
              border: '1px solid rgba(255,178,62,0.28)',
            }}
          >
            {post.spotsLeft} spot{post.spotsLeft !== 1 ? 's' : ''} left
          </span>
        )}
      </div>

      {/* Activity text */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
        {post.text}
      </p>

      {/* Going count + joinedLastHour badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          <Users size={13} aria-hidden="true" />
          <span>{post.goingCount} going</span>
        </div>
        {post.joinedLastHour !== undefined && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-pill"
            style={{
              background: 'rgba(31,174,107,0.1)',
              color: 'var(--color-emerald)',
              border: '1px solid rgba(31,174,107,0.2)',
            }}
          >
            +{post.joinedLastHour} joined this hour
          </span>
        )}
      </div>
    </div>
  );
}
