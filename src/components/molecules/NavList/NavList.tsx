import { ScrambleLink } from "@/components/atoms/ScrambleLink";
import type { NavItem } from "@/content/navigation";
import { getNavSection } from "@/content/routes";
import styles from "./NavList.module.css";

export interface NavListProps {
  items: readonly NavItem[];
  /** Bieżąca ścieżka (`usePathname()` w rodzicu klienckim). */
  pathname: string;
  /** Nazwa landmarku, np. „Główna”. */
  ariaLabel: string;
  className?: string;
}

type AriaCurrent = "page" | "true" | undefined;

/**
 * `page` przy dokładnej ścieżce (np. /o-nas), `true` gdy strona należy do sekcji
 * linku (case study → Realizacje). Linki-kotwice (`/#…`, `#…`) same z siebie nie są „page”.
 */
export function getAriaCurrent(item: NavItem, pathname: string): AriaCurrent {
  const [path, hash] = item.href.split("#");
  if (!hash && path === pathname) return "page";
  if (item.section && pathname !== "/" && getNavSection(pathname) === item.section) return "true";
  return undefined;
}

/** Lista linków nawigacji (mono, scramble na hover). Server-compatible (bez hooków). */
export function NavList({ items, pathname, ariaLabel, className }: NavListProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <ScrambleLink href={item.href} className={styles.link} aria-current={getAriaCurrent(item, pathname)}>
              {item.label}
            </ScrambleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
