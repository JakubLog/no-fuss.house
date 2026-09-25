import type { ProcessSectionStep } from "@/content/process";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./ProcessSection.module.css";

export interface ProcessSectionProps {
  /** Kotwica sekcji, np. „proces”. Nagłówek dostaje `${id}-heading`. */
  id: string;
  /** Nagłówek `h2` w mono, np. „Jak pracujemy”. */
  label: string;
  steps: readonly ProcessSectionStep[];
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Sekcja procesu współpracy (strona główna, `#proces`): nagłówek mono (jedyny reveal w sekcji)
 * i kroki w `<ol>` jako lekkie kolumny jak `FactRow`: kreska 1 px nad krokiem, numer mono
 * (jedyna numeracja na stronie głównej, bo to faktyczna kolejność), tytuł `h3` w roli title,
 * opis `--muted`. Siatka 1 → 2 (640 px) → 4 kolumny (1024 px); kroki dzielą wiersze przez subgrid,
 * więc numery, tytuły i opisy stoją w rzędzie w jednej linii. Hover (tylko myszą): limonkowe tło kolumny
 * i treść wcięta o 12 px, jak w `FaqSection`. W odróżnieniu od `ProcessSteps` (case Automation House)
 * nic nie jest fokusowalne ani ukryte za hoverem. Server Component, dane z propsów.
 */
export function ProcessSection({ id, label, steps, tone = "light", className }: ProcessSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx("section", tone === "dark" ? "tone-dark" : "tone-light", className)}
    >
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={headingId} className={cx("fade", styles.label)}>
          {label}
        </h2>
      </Reveal>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.no} className={styles.step}>
            <span className={cx("mono", styles.no)} aria-hidden="true">
              {step.no}
            </span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
