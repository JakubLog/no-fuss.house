import Link from "next/link";
import type { Ref } from "react";
import { Line } from "@/components/atoms/Line";
import { Tag } from "@/components/atoms/Tag";
import { CopyEmail } from "@/components/molecules/CopyEmail";
import { getAriaCurrent } from "@/components/molecules/NavList";
import type { NavItem } from "@/content/navigation";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { isInternalHref } from "@/lib/href";
import styles from "./MobileMenu.module.css";

export interface MobileMenuProps {
  ref?: Ref<HTMLDivElement>;
  /** Cel `aria-controls` przycisku „Menu” w HUD. */
  id: string;
  open: boolean;
  items: readonly NavItem[];
  pathname: string;
  /** Klik w link nawigacji (HUD zamyka menu). */
  onNavigate: () => void;
}

/**
 * Pełnoekranowe menu na telefonie (< 768 px), pod HUD (z-index 49 < 50), więc logo i przycisk
 * zostają na wierzchu. Ciemna kurtyna zjeżdża z góry, linki w roli display wjeżdżają od dołu
 * ze staggerem (`Line` + `is-in`), pod nimi e-mail (`CopyEmail`). Wiersze z obrysem 1 px jak FAQ,
 * przy dolnej krawędzi (w zasięgu kciuka); bieżąca strona albo sekcja ma tag „Tu jesteś”.
 * Stan i zamykanie trzyma `Hud` (ma funkcję w propsach, więc renderuje go tylko Client Component).
 */
export function MobileMenu({ ref, id, open, items, pathname, onNavigate }: MobileMenuProps) {
  return (
    <div
      ref={ref}
      id={id}
      className={cx("tone-dark", styles.menu, open && "is-in")}
      data-open={open ? "" : undefined}
      data-lenis-prevent=""
    >
      <nav aria-label="Główna" className={styles.nav}>
        <ul className={styles.list}>
          {items.map((item, index) => {
            const current = getAriaCurrent(item, pathname);
            const content = (
              <>
                <Line index={index}>{item.label}</Line>
                {current && (
                  <span aria-hidden="true" className={styles.here}>
                    <Tag>Tu jesteś</Tag>
                  </span>
                )}
              </>
            );
            return (
              <li key={item.href} className={styles.item}>
                {isInternalHref(item.href) ? (
                  <Link href={item.href} className={styles.link} aria-current={current} onClick={onNavigate}>
                    {content}
                  </Link>
                ) : (
                  <a href={item.href} className={styles.link} aria-current={current} onClick={onNavigate}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <p className={cx("mono", "fade", styles.meta)} style={{ "--i": items.length }}>
        <CopyEmail email={site.contact.email} className={styles.email} />
      </p>
    </div>
  );
}
