import { Fade } from "@/components/atoms/Fade";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./EvolutionStrip.module.css";

export interface EvolutionStep {
  /** Wersja i data mono, np. „v0.5 · 07.2025”. */
  when: string;
  title: string;
  text: string;
  image: Required<CaseStudyImage>;
}

export interface EvolutionStripProps {
  steps: readonly EvolutionStep[];
  className?: string;
}

/**
 * Oś ewolucji produktu: kolejne wersje ekranu w makiecie telefonu, pod każdą wersja, tytuł
 * i jedno zdanie. Na telefonie przewijana poziomo (scroll-snap), od 1024 px pięć kolumn.
 * Server Component.
 */
export function EvolutionStrip({ steps, className }: EvolutionStripProps) {
  return (
    <Reveal as="ol" className={cx(styles.strip, className)}>
      {steps.map((step, i) => (
        <Fade key={step.when} as="li" index={i} className={styles.step}>
          <PhoneFrame image={step.image} sizes="(max-width: 1023px) 70vw, 18vw" />
          <span className={cx("mono-sm", styles.when)}>{step.when}</span>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.text}>{step.text}</p>
        </Fade>
      ))}
    </Reveal>
  );
}
