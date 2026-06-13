import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PassportCardProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, renders at shadow-2 depth (no hover lift — already elevated). */
  elevated?: boolean;
}

export function PassportCard({
  className,
  elevated = false,
  children,
  ...props
}: PassportCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-edge passport-notch texture-paper",
        "transition-shadow duration-200",
        elevated
          ? "[box-shadow:var(--shadow-2)]"
          : "[box-shadow:var(--shadow-1)] hover:[box-shadow:var(--shadow-2)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
