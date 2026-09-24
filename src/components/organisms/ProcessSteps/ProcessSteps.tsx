import { cx } from "@/lib/cx";
import styles from "./ProcessSteps.module.css";

export interface ProcessStep {
  /** Nazwa kroku, np. „Discovery”. */
  title: string;
  /** Opis odsłaniany na hover / fokus. */
  text: string;
}

export interface ProcessStepsProps {
  steps: readonly ProcessStep[];
  /** Nazwa listy dla czytników, np. „Rebranding”. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Proces jako taśma kroków (legacy `.steps`, Automation House): numer 01–05 z licznika CSS,
 * nazwa, opis rozwijany na hover i `:focus-within` (krok ma `tabIndex=0`, więc działa
 * z klawiatury i tapnięciem). Bez JS. Musi być wewnątrz `Reveal`. Server Component.
 */
export function ProcessSteps({ steps, ariaLabel, className }: ProcessStepsProps) {
  return (
    <ol className={cx(styles.steps, className)} aria-label={ariaLabel}>
      {steps.map((step, i) => (
        <li key={step.title} className={cx("fade", styles.step)} style={i ? { "--i": i } : undefined} tabIndex={0} data-cursor="arrow">
          <div>
            <strong className={styles.title}>{step.title}</strong>
            <small className={cx("mono-sm", styles.text)}>{step.text}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
