import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Brand button. Renders as a Next.js Link when `href` is provided, otherwise a
 * native <button>. Shared component (no "use client"): usable from both Server
 * and Client Components. Event handlers may only be passed from client parents.
 *
 * Variants:
 *  - primary   electric-blue gradient (main CTA)
 *  - secondary solid navy panel with hairline border
 *  - ghost     transparent with hairline border
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vx-blue focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-vx-bg disabled:opacity-50 disabled:pointer-events-none " +
  "motion-safe:hover:-translate-y-0.5 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-vx-blue to-vx-cyan text-vx-bg shadow-vx-glow-sm " +
    "hover:shadow-vx-glow",
  secondary:
    "bg-vx-bg2 text-vx-ink border border-[rgba(14,165,233,0.25)] " +
    "hover:border-[rgba(14,165,233,0.55)]",
  ghost:
    "bg-transparent text-vx-ink border border-[rgba(14,165,233,0.25)] " +
    "hover:border-vx-blue hover:text-vx-blue",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-3",
  lg: "text-base px-6 py-3.5",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cx(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as ComponentPropsWithoutRef<"a"> & {
      href: string;
    };
    return (
      <Link href={href} className={classes} data-magnetic="true" {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button className={classes} data-magnetic="true" {...buttonRest}>
      {children}
    </button>
  );
}
