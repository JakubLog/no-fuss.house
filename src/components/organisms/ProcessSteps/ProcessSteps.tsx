"use client";

import { useEffect, useRef, useState } from "react";
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

/** Ile ms świeci każdy krok w przebiegu. 5 kroków ≈ 3,5 s: poniżej 5 s, więc bez przycisku pauzy (WCAG 2.2.2). */
const SWEEP_STEP_MS = 700;
/** Start przebiegu po wejściu w widok: kafle kończą reveal (`.fade`, 900 ms od progu `Reveal`). */
const SWEEP_DELAY_MS = 600;

/**
 * Proces jako taśma kroków (legacy `.steps`, Automation House): numer 01–05 z licznika CSS,
 * nazwa, opis rozwijany na hover i `:focus-within` (krok ma `tabIndex=0`, więc działa
 * z klawiatury i tapnięciem). Po wejściu w widok (górna krawędź listy nad 60% wysokości okna)
 * kroki raz podświetlają się po kolei (`.active`: limonka jak na hover, opis zostaje zwinięty),
 * potem wszystkie gasną. Hover i fokus mają pierwszeństwo (CSS). Przy reduced motion przebiegu nie ma.
 * Musi być wewnątrz `Reveal`. Client Component.
 */
export function ProcessSteps({ steps, ariaLabel, className }: ProcessStepsProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const count = steps.length;

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    let timer = 0;
    const show = (index: number) => {
      setActive(index < count ? index : null);
      if (index < count) timer = window.setTimeout(() => show(index + 1), SWEEP_STEP_MS);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Jak `CountUp`: preferencja sprawdzana w chwili startu.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timer = window.setTimeout(() => show(0), SWEEP_DELAY_MS);
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(list);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [count]);

  return (
    <ol ref={listRef} className={cx(styles.steps, className)} aria-label={ariaLabel}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cx("fade", styles.step, i === active && styles.active)}
          style={i ? { "--i": i } : undefined}
          tabIndex={0}
          data-cursor="arrow"
        >
          <div>
            <strong className={styles.title}>{step.title}</strong>
            <small className={cx("mono-sm", styles.text)}>{step.text}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
