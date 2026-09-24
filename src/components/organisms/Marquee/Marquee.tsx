import { cx } from "@/lib/cx";
import { Reveal } from "@/components/organisms/Reveal";
import styles from "./Marquee.module.css";

export interface MarqueeProps {
  /** Jedna kopia treści; separator „✦” dokleja komponent. */
  items: readonly string[];
  /** Ile razy powielić treść (parzyste: pętla przesuwa o połowę). Domyślnie 4 jak w legacy. */
  copies?: number;
  className?: string;
}

/**
 * Limonkowy pasek przewijany w pętli 22 s (legacy `.marquee`). Czytnik ekranu
 * dostaje jedną kopię, pozostałe mają `aria-hidden`. Przy `prefers-reduced-motion`
 * pasek stoi. Pasek odsłania się z opacity/translateY przy wejściu w viewport
 * (`.fade` na kontenerze; pętla przewijania jedzie na `translate`, więc nie koliduje
 * z `transform` reveal). Server Component (Reveal jest kliencki).
 */
export function Marquee({ items, copies = 4, className }: MarqueeProps) {
  return (
    <Reveal className={cx(styles.marquee, "fade", className)}>
      <div className={styles.track}>
        {Array.from({ length: copies }, (_, copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy > 0 ? true : undefined}>
            {items.map((item) => (
              <span key={item} className={styles.item}>
                {item} <span aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
