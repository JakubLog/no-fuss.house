import { Fade } from "@/components/atoms/Fade";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import { CountUp } from "./CountUp";
import styles from "./CaseNumbers.module.css";

export interface CaseNumber {
  /** Liczba (animowana) albo tekst, np. placeholder „[?]”. */
  value: number | string;
  label: string;
  /** Kafel limonkowy zamiast ciemnego. */
  accent?: boolean;
}

export interface CaseNumbersProps {
  items: readonly CaseNumber[];
  className?: string;
}

/**
 * Kafle „W liczbach” (legacy `.nums`): 2 kolumny (nieparzysty ostatni na całą szerokość),
 * od 900 px jeden rząd z kolumną na każdy kafel; licznik od zera
 * przy wejściu w viewport. Server Component; animuje tylko liść `CountUp` (client).
 */
export function CaseNumbers({ items, className }: CaseNumbersProps) {
  return (
    <Reveal as="ul" className={cx(styles.nums, className)}>
      {items.map((item, i) => (
        <Fade key={item.label} as="li" index={i} className={cx(styles.num, item.accent && styles.accent)}>
          <strong className={styles.value}>
            {typeof item.value === "number" ? <CountUp end={item.value} /> : item.value}
          </strong>
          <span className="mono-sm">{item.label}</span>
        </Fade>
      ))}
    </Reveal>
  );
}
