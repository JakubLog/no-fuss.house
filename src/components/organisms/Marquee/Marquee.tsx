import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/components/organisms/Reveal";
import styles from "./Marquee.module.css";

export interface MarqueeLoopProps {
  /** Jedna kopia treści; komponent powiela ją `copies` razy w jednym rzędzie. */
  children: ReactNode;
  /**
   * Ile kopii (parzyście: pętla przesuwa tor o połowę, więc połowa toru musi być szersza niż okno).
   * Domyślnie 4 jak w legacy.
   */
  copies?: number;
  /** Klasa okna pętli; tempo przez `--marquee-duration` (domyślnie 22 s). */
  className?: string;
}

/**
 * Pętla przewijana w poziomie (mechanika legacy `.marquee`): `copies` kopii `children` w rzędzie,
 * tor przesuwa się liniowo o połowę i wraca bez szwu. Czytnik ekranu dostaje pierwszą kopię,
 * pozostałe mają `aria-hidden`. Przy `prefers-reduced-motion` stoi. Server Component.
 */
export function MarqueeLoop({ children, copies = 4, className }: MarqueeLoopProps) {
  return (
    <div className={cx(styles.loop, className)}>
      <div className={styles.track}>
        {Array.from({ length: copies }, (_, copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy > 0 ? true : undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface MarqueeProps {
  /** Jedna kopia treści; separator „✦” dokleja komponent. */
  items: readonly string[];
  /** Ile razy powielić treść (parzyste: pętla przesuwa o połowę). Domyślnie 4 jak w legacy. */
  copies?: number;
  className?: string;
}

/**
 * Limonkowy pasek przewijany w pętli 22 s (legacy `.marquee`, pętla z `MarqueeLoop`). Pasek odsłania
 * się z opacity/translateY przy wejściu w viewport (`.fade` na kontenerze; pętla jedzie na `translate`,
 * więc nie koliduje z `transform` reveal). Server Component (Reveal jest kliencki).
 */
export function Marquee({ items, copies = 4, className }: MarqueeProps) {
  return (
    <Reveal className={cx(styles.marquee, "fade", className)}>
      <MarqueeLoop copies={copies}>
        {items.map((item) => (
          <span key={item} className={styles.item}>
            {item} <span aria-hidden="true">✦</span>
          </span>
        ))}
      </MarqueeLoop>
    </Reveal>
  );
}
