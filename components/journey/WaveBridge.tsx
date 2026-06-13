import { cn } from '@/lib/utils';

interface WaveBridgeProps {
  /** Color of the wave fill — the destination section's color. */
  fill: string;
  /** Background of the wrapper div — the source section's color. Default: transparent. */
  base?: string;
  /** Flip the wave vertically with scaleY(-1). Useful for reversed transitions. */
  flip?: boolean;
  /** Height of the bridge div in px. Default: 80. */
  height?: number;
  className?: string;
}

/**
 * WaveBridge — curved SVG section seam, placed between two sections.
 *
 * The wave is drawn as a single cubic-bezier arch that rises from the bottom
 * edge: its endpoints sit at y=60 (lower third of the SVG) and the peak reaches
 * y=8, so the `fill` colour peeks through from below in a smooth organic curve.
 *
 * Static — no motion needed; reduced-motion contract is satisfied automatically.
 * Always aria-hidden (purely decorative).
 */
export function WaveBridge({
  fill,
  base,
  flip = false,
  height = 80,
  className,
}: WaveBridgeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('block w-full overflow-hidden', className)}
      style={{ background: base ?? 'transparent', height }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block w-full h-full"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
        aria-hidden="true"
        focusable="false"
      >
        {/*
          Path reads: go to bottom-right, then up to y=60 on the right edge, then
          arc with two control points (1080,8) and (360,8) to the left edge at
          y=60, then close straight across the bottom. This fills the arch region
          with `fill` and leaves the top portion showing the `base` background.
        */}
        <path d="M0,80 L1440,80 L1440,60 C1080,8 360,8 0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}
