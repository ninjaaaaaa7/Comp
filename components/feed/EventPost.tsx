import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import type { EventPost as EventPostData } from './data';

interface Props {
  post: EventPostData;
}

const TAG_PALETTE: Record<string, string> = {
  'Café Chat':        '#FFB23E',
  'Book Browsing':    '#7A4FE0',
  'Street Food Tour': '#FFB23E',
  'Yoga':             '#1FAE6B',
  'Morning Run':      '#1FAE6B',
  'City Walk':        '#2E6BFF',
  'Museum':           '#7A4FE0',
};
const tagColor = (tag: string) => TAG_PALETTE[tag] ?? '#2E6BFF';

export function EventPost({ post }: Props) {
  const color = tagColor(post.activityTag);

  return (
    <div
      className="rounded-[var(--radius-md)] overflow-hidden"
      style={{
        border: '1.5px solid rgba(46,107,255,0.1)',
        background: 'rgba(46,107,255,0.025)',
      }}
    >
      {/* Colour accent stripe */}
      <div className="h-1" style={{ background: color }} />

      <div className="p-4 flex flex-col gap-3">
        {/* Category label */}
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {post.activityTag}
        </span>

        {/* Event title */}
        <h3
          className="text-base font-semibold leading-snug"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          {post.title}
        </h3>

        {/* Date + Place */}
        <div className="flex flex-col gap-1.5">
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            <Calendar size={14} aria-hidden="true" />
            <span>{post.dateTime}</span>
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            <MapPin size={14} aria-hidden="true" />
            <span>{post.place}</span>
          </div>
        </div>

        {/* Stacked avatars + going count + joinedLastHour badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex -space-x-2" aria-hidden="true">
            {post.goingAvatars.slice(0, 4).map((av, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full overflow-hidden border-2 border-white relative shrink-0"
                style={{ zIndex: 10 - i }}
              >
                <Image src={av} alt="" fill sizes="28px" className="object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--color-ink-muted)' }}>
            {post.goingCount} going
          </span>
          {post.joinedLastHour !== undefined && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-pill"
              style={{
                background: 'rgba(31,174,107,0.1)',
                color: 'var(--color-emerald)',
                border: '1px solid rgba(31,174,107,0.2)',
              }}
            >
              +{post.joinedLastHour} this hour
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
