import type { ElementType, ReactNode } from "react";

/**
 * Centered content wrapper with the site's max width and responsive gutters.
 * `as` lets callers render it as <section>, <header>, <footer>, etc.
 */
interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export default function Container({
  as: Tag = "div",
  children,
  className,
}: ContainerProps) {
  return (
    <Tag className={["mx-auto w-full max-w-[1200px] px-5 lg:px-8", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
