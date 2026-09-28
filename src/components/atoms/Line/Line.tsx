import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface LineProps {
  children: ReactNode;
  /** Indeks w staggerze reveal (opóźnienie = index × 80 ms). */
  index?: number;
  className?: string;
}

/**
 * Linia nagłówka odsłaniana od dołu (`.line > span`, klasy globalne).
 * Odsłania się, gdy przodek dostanie `is-in` (Reveal). Server Component.
 */
export function Line({ children, index, className }: LineProps) {
  return (
    <span className={cx("line", className)} style={index ? { "--i": index } : undefined}>
      <span>{children}</span>
    </span>
  );
}
