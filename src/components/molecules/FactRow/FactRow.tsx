import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./FactRow.module.css";

export interface FactRowProps {
  /** Etykieta, np. „Klient”, „Platformy”. */
  term: ReactNode;
  /** Wartość; może zawierać link (podkreślony automatycznie). */
  children: ReactNode;
  className?: string;
}

/**
 * Jeden fakt w liście `<dl>` (legacy `.cs-meta div`): kreska 1 px u góry,
 * etykieta przygaszona, wartość pod spodem. Kolory z `currentColor`, więc działa
 * na ciemnym i jasnym tle. Musi być dzieckiem `<dl>`. Server Component.
 */
export function FactRow({ term, children, className }: FactRowProps) {
  return (
    <div className={cx(styles.row, className)}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{children}</dd>
    </div>
  );
}
