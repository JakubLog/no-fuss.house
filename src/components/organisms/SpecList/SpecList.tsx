import { Tag } from "@/components/atoms/Tag";
import { FactRow } from "@/components/molecules/FactRow";
import { cx } from "@/lib/cx";
import styles from "./SpecList.module.css";

export interface SpecItem {
  /** Etykieta mono, np. „Klient”. */
  term: string;
  /** Wartość, np. „Busy Bee Film”, „busybeefilm.pl ↗”. */
  value: string;
  /** Limonkowy chip po wartości, np. „Webflow”. */
  chip?: string;
  /** Link zewnętrzny (nowa karta). */
  href?: string;
}

export interface SpecListProps {
  items: readonly SpecItem[];
  /**
   * `rows` (domyślnie): wielkie wiersze (legacy `.spec`, Busy Bee / AH / OTB).
   * `tiles`: kafle 2 / 4 kolumny (legacy `.facts`, Sassy).
   */
  variant?: "rows" | "tiles";
  className?: string;
}

/**
 * Fakty case study jako `<dl>` z `FactRow`. Każdy wiersz ma `.fade` (stagger przez
 * `nth-child` w CSS), więc lista musi być wewnątrz `Reveal` (np. `CaseStudySection`).
 * Server Component.
 */
export function SpecList({ items, variant = "rows", className }: SpecListProps) {
  return (
    <dl className={cx(variant === "tiles" ? styles.tiles : styles.rows, className)}>
      {items.map((item) => (
        <FactRow key={item.term} term={item.term} className={cx("fade", styles.row)}>
          {item.href ? (
            <a className={styles.link} href={item.href} target="_blank" rel="noopener">
              {item.value}
            </a>
          ) : (
            item.value
          )}
          {item.chip ? <Tag className={styles.chip}>{item.chip}</Tag> : null}
        </FactRow>
      ))}
    </dl>
  );
}
