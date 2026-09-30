import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Tally.module.css";

export interface TallyItem {
  label: ReactNode;
  value: ReactNode;
}

export interface TallyProps {
  /** Wiersze: etykieta po lewej, wartość po prawej, między nimi kropki (np. `TallyRow` z treści). */
  rows: readonly TallyItem[];
  /** Nazwa listy dla czytników, np. „W skrócie”. */
  ariaLabel?: string;
  className?: string;
}

/**
 * „Paragon” w mono: `<dl>`, w wierszu etykieta, kropkowany odstęp (`dt::after`) i wartość do prawej.
 * Kolory z `currentColor` i `--muted`, więc działa na jasnym i ciemnym tle (`CookieNotice`, „W skrócie”
 * polityki prywatności). Server Component.
 */
export function Tally({ rows, ariaLabel, className }: TallyProps) {
  return (
    <dl className={cx("mono", styles.tally, className)} aria-label={ariaLabel}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
