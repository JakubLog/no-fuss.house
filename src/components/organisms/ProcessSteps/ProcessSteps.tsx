"use client";

import { useId, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useSweep } from "@/lib/hooks/useSweep";
import styles from "./ProcessSteps.module.css";

export interface ProcessStep {
  /** Nazwa kroku, np. „Discovery”. */
  title: string;
  /** Opis rozwijany przyciskiem (na hover także podglądany). */
  text: string;
}

export interface ProcessStepsProps {
  steps: readonly ProcessStep[];
  /** Nazwa listy dla czytników, np. „Rebranding”. */
  ariaLabel?: string;
  className?: string;
}

/** Ile ms świeci każdy krok w przebiegu. 5 kroków ≈ 3,5 s: poniżej 5 s, więc bez przycisku pauzy (WCAG 2.2.2). */
const SWEEP_STEP_MS = 700;
/** Start przebiegu po wejściu w widok: kafle kończą reveal (`.fade`, 900 ms od progu `Reveal`). */
const SWEEP_DELAY_MS = 600;

/**
 * Proces jako taśma kroków (legacy `.steps`, Automation House): numer 01–05 z licznika CSS,
 * nazwa (`h3`), opis. Z myszą: hover podgląda opis, a nazwa kroku to przycisk rozwijający
 * (`aria-expanded`, klik w cały kafel, Enter / Spacja z klawiatury; otwarty jest jeden krok naraz).
 * Bez hovera (dotyk) opisy są widoczne od razu i przycisków nie ma (serwer renderuje przyciski).
 * Po wejściu w widok (górna krawędź listy nad 60% wysokości okna) kroki raz podświetlają się
 * po kolei (`.active`: limonka jak na hover, opis zostaje zwinięty), potem wszystkie gasną.
 * Hover i fokus mają pierwszeństwo (CSS). Przy reduced motion przebiegu nie ma.
 * Musi być wewnątrz `Reveal`. Client Component.
 */
export function ProcessSteps({ steps, ariaLabel, className }: ProcessStepsProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const active = useSweep(listRef, steps.length, { stepMs: SWEEP_STEP_MS, delayMs: SWEEP_DELAY_MS });
  const canHover = useMediaQuery("(hover: hover)", true);
  const [open, setOpen] = useState<number | null>(null);
  const idBase = useId();

  return (
    <ol ref={listRef} className={cx(styles.steps, className)} aria-label={ariaLabel}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cx("fade", styles.step, i === active && styles.active, canHover && i === open && styles.open)}
          style={i ? { "--i": i } : undefined}
        >
          <div>
            <h3 className={styles.title}>
              {canHover ? (
                <button
                  type="button"
                  className={styles.toggle}
                  aria-expanded={i === open}
                  aria-controls={`${idBase}-${i}`}
                  onClick={() => setOpen(i === open ? null : i)}
                >
                  {step.title}
                </button>
              ) : (
                step.title
              )}
            </h3>
            <p id={`${idBase}-${i}`} className={cx("mono-sm", styles.text)}>
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
