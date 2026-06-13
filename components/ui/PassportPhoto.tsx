import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoSize = "sm" | "md" | "lg";

const sizes: Record<PhotoSize, { w: number; h: number; textCls: string }> = {
  sm: { w: 64, h: 80, textCls: "text-xl" },
  md: { w: 88, h: 110, textCls: "text-2xl" },
  lg: { w: 120, h: 150, textCls: "text-4xl" },
};

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

interface PassportPhotoProps {
  /** Next.js-compatible image URL. Omit to show initials fallback. */
  src?: string;
  name: string;
  size?: PhotoSize;
  className?: string;
}

/**
 * Embossed oval portrait frame with brass ring.
 * Mimics the formal framing of a passport/ID photo.
 */
export function PassportPhoto({
  src,
  name,
  size = "md",
  className,
}: PassportPhotoProps) {
  const { w, h, textCls } = sizes[size];

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={{
        width: w,
        height: h,
        borderRadius: "50%",
        border: "3px solid var(--color-brass)",
        boxShadow:
          "inset 0 3px 10px rgba(0,0,0,0.22), inset 0 -1px 4px rgba(255,255,255,0.12), 0 2px 6px rgba(60,30,15,0.15)",
      }}
      role="img"
      aria-label={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={w}
          height={h}
          className="object-cover object-top w-full h-full"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center bg-oat",
            "font-display font-semibold text-ink-muted",
            textCls
          )}
          aria-hidden="true"
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}
