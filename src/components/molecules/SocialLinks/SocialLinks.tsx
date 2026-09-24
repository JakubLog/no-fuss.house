import { ScrambleLink } from "@/components/atoms/ScrambleLink";
import type { SocialLink } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./SocialLinks.module.css";

export interface SocialLinksProps {
  links: readonly SocialLink[];
  /** Nazwa landmarku `<nav>`, np. „Social” (1:1 z legacy stopki). */
  ariaLabel: string;
  className?: string;
}

/**
 * Linki social ze scramble, otwierane w nowej karcie. Placeholdery (`href: null`) się
 * nie renderują (lista równorzędnych profili: brakujący nic nie wnosi); bez żadnego
 * prawdziwego linku komponent zwraca `null` (bez pustego landmarku). Server-compatible.
 */
export function SocialLinks({ links, ariaLabel, className }: SocialLinksProps) {
  const live = links.flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));
  if (live.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={cx(styles.list, className)}>
      {live.map((link) => (
        <ScrambleLink key={link.network} href={link.href} external className={styles.link}>
          {link.label}
        </ScrambleLink>
      ))}
    </nav>
  );
}
