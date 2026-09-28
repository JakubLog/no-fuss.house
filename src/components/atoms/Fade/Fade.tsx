import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface FadeProps {
  children: ReactNode;
  /** Indeks w staggerze reveal (opóźnienie = index × 80 ms). */
  index?: number;
  as?: "div" | "span" | "p" | "figure" | "figcaption" | "li" | "dl" | "ul";
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/**
 * Element wjeżdżający z przezroczystości (`.fade`, klasa globalna).
 * Odsłania się, gdy przodek dostanie `is-in` (Reveal). Server Component.
 */
export function Fade({ children, index, as: Tag = "div", className, style, id }: FadeProps) {
  return (
    <Tag id={id} className={cx("fade", className)} style={index ? { ...style, "--i": index } : style}>
      {children}
    </Tag>
  );
}
