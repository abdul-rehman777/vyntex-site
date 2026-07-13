import type { ElementType, ReactNode } from "react";

/**
 * Elevated panel card. Hover lift + electric-blue glow are pure CSS (no JS),
 * and the lift is gated behind `motion-safe` so reduced-motion users get a
 * static border change only. Presentational shared component.
 */
interface GlowCardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Adds a stronger blue border to mark a featured/"popular" item. */
  featured?: boolean;
}

export default function GlowCard({
  as: Tag = "div",
  children,
  className,
  featured = false,
}: GlowCardProps) {
  return (
    <Tag
      className={[
        "group relative rounded-2xl bg-vx-bg2 p-6 transition-[border-color,box-shadow,transform] duration-200",
        featured
          ? "border border-vx-blue/60 shadow-vx-glow-sm"
          : "border border-[rgba(14,165,233,0.12)]",
        "hover:border-[rgba(14,165,233,0.5)] hover:shadow-vx-glow motion-safe:hover:-translate-y-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
