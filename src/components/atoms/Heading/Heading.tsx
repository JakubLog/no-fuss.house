import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Line } from "../Line";
import styles from "./Heading.module.css";

/** Role typograficzne sans z DESIGN.md (bez `body`, który jest w `Text`). */
export type HeadingVariant = "mega" | "display" | "h2" | "statement" | "title" | "lead";

export interface HeadingProps {
  /**
   * Rola typograficzna (w specyfikacji: „role”). Nazwa `variant`, bo `role`
   * to atrybut ARIA. Domyślnie `h2`.
   */
  variant?: HeadingVariant;
  /** Element HTML. Semantyka jest niezależna od wyglądu. Domyślnie `h2`. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  /**
   * Linie odsłaniane od dołu ze staggerem 80 ms. Gdy podane, `children` jest ignorowane.
   * Przy samych stringach `aria-label` składa się automatycznie.
   */
  lines?: readonly ReactNode[];
  /** Indeks staggeru pierwszej linii (np. 1, gdy przed nagłówkiem jest etykieta z `--i:0`). */
  startIndex?: number;
  children?: ReactNode;
  /** Wersaliki. Domyślnie `true` dla mega, display, h2. */
  uppercase?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

const UPPERCASE_BY_DEFAULT: Record<HeadingVariant, boolean> = {
  mega: true,
  display: true,
  h2: true,
  statement: false,
  title: false,
  lead: false,
};

/** Nagłówek w jednej z ról typograficznych. Server Component. */
export function Heading({
  variant = "h2",
  as: Tag = "h2",
  lines,
  startIndex = 0,
  children,
  uppercase,
  className,
  id,
  "aria-label": ariaLabel,
}: HeadingProps) {
  const upper = uppercase ?? UPPERCASE_BY_DEFAULT[variant];
  const autoLabel =
    lines && lines.every((l) => typeof l === "string") ? (lines as readonly string[]).join(" ") : undefined;

  return (
    <Tag
      id={id}
      className={cx(styles[variant], upper && styles.upper, className)}
      aria-label={ariaLabel ?? autoLabel}
    >
      {lines
        ? lines.map((line, i) => (
            <Line key={i} index={startIndex + i}>
              {line}
            </Line>
          ))
        : children}
    </Tag>
  );
}
