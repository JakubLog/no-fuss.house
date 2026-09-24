import type { ProcessSectionStep } from "@/content/process";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./ProcessSection.module.css";

export interface ProcessSectionProps {
  /** Kotwica sekcji, np. „proces”. Nagłówek dostaje `${id}-heading`. */
  id: string;
  /** Nagłówek `h2` w mono, np. „Jak pracujemy”. */
  label: string;
  /** Licznik obok nagłówka, np. „01–04” (dla czytników ukryty). */
  counter?: string;
  steps: readonly ProcessSectionStep[];
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Sekcja procesu współpracy (strona główna, `#proces`): nagłówek mono z licznikiem i kroki
 * w `<ol>` jako ciemne kafle (numer w roli display, tytuł `h3` w roli title, opis zawsze
 * widoczny). Siatka 1 → 2 (640 px) → 4 kolumny (1024 px). W odróżnieniu od `ProcessSteps`
 * (case Automation House) opisy nie chowają się za hoverem i nic nie jest fokusowalne.
 * Server Component, dane z propsów.
 */
export function ProcessSection({ id, label, counter, steps, tone = "light", className }: ProcessSectionProps) {
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
        {counter ? (
          <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
            {counter}
          </span>
        ) : null}
      </Reveal>
      <Reveal as="ol" className={styles.steps}>
        {steps.map((step, i) => (
          <li key={step.no} className={cx("fade", "tone-dark", styles.step)} style={i ? { "--i": i } : undefined}>
            <span className={styles.no} aria-hidden="true">
              {step.no}
            </span>
            <div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
