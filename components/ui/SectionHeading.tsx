import type { ReactNode } from "react";

/**
 * Standard section header: mono eyebrow, gradient-accented H2, muted lead.
 * Presentational and localization-agnostic — callers pass already-translated
 * strings. `align` supports centered (default) or left-aligned headers.
 */
interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  return (
    <div
      className={[
        "flex max-w-2xl flex-col gap-3",
        alignment,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-vx-blue">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-extrabold leading-tight text-vx-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-vx-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
