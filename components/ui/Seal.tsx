"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SealProps {
  size?: number;
  /** Accessible name when the Seal is the logo / non-decorative. */
  label?: string;
  decorative?: boolean;
  className?: string;
}

export function Seal({
  size = 56,
  label,
  decorative = false,
  className,
}: SealProps) {
  const iconSize = Math.round(size * 0.38);

  return (
    <motion.div
      whileHover={{ rotate: 3, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        "rounded-full shrink-0 cursor-default",
        className
      )}
      style={{
        width: size,
        height: size,
        background: "var(--grad-seal)",
        boxShadow:
          "inset 0 2px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.12), 0 2px 8px rgba(110,79,163,0.4)",
      }}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? label : undefined}
    >
      {/* Foil-sheen sweep on hover */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(130deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />

      {/* Inner emboss ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.2)" }}
        aria-hidden="true"
      />

      <Heart
        size={iconSize}
        className="text-white relative z-10"
        fill="white"
        strokeWidth={0}
        aria-hidden="true"
      />
    </motion.div>
  );
}
