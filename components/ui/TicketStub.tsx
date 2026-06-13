import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TicketStubProps {
  children: ReactNode;
  /** Content rendered in the narrow stub tab on the right. */
  stub?: ReactNode;
  className?: string;
}

/**
 * Rectangular booking stub with a perforated separator:
 * dashed vertical line + punched-notch circles at top/bottom edge.
 */
export function TicketStub({ children, stub, className }: TicketStubProps) {
  return (
    <div
      className={cn(
        "relative flex overflow-visible",
        "border border-edge bg-surface passport-notch",
        "[box-shadow:var(--shadow-1)]",
        className
      )}
    >
      {/* Perforated notch circles — positioned on the separator line */}
      <div
        aria-hidden="true"
        className="absolute left-3/4 top-0 -translate-x-1/2 -translate-y-1/2
                   w-3 h-3 rounded-full bg-paper border border-edge z-10"
      />
      <div
        aria-hidden="true"
        className="absolute left-3/4 bottom-0 -translate-x-1/2 translate-y-1/2
                   w-3 h-3 rounded-full bg-paper border border-edge z-10"
      />

      {/* Dashed perforation line */}
      <div
        aria-hidden="true"
        className="absolute left-3/4 top-0 bottom-0 w-px -translate-x-1/2
                   border-l-2 border-dashed border-edge"
      />

      {/* Main content */}
      <div className="flex-1 p-5 min-w-0">{children}</div>

      {/* Stub tab */}
      <div className="w-1/4 shrink-0 flex items-center justify-center p-3 bg-oat rounded-br-md">
        {stub ?? (
          <span
            className="label-eyebrow text-ink-muted"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Stub
          </span>
        )}
      </div>
    </div>
  );
}
