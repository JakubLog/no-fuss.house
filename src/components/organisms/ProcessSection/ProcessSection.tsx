"use client";

import { useRef } from "react";
import type { ProcessSectionStep } from "@/content/process";
import { cx } from "@/lib/cx";
import { useSweep } from "@/lib/hooks/useSweep";
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

/** Ile ms świeci każdy krok w zapętlonym przebiegu (cykl 4 kroków = 5,6 s). */
const SWEEP_STEP_MS = 1400;
/** Start przebiegu po wejściu w widok: krótka pauza, żeby pierwszy krok nie zapalał się w trakcie przewijania. */
const SWEEP_DELAY_MS = 300;

/**
 * Sekcja procesu współpracy (strona główna, `#proces`): nagłówek mono (jedyny reveal w sekcji)
 * i kroki w `<ol>` jako lekkie kolumny jak `FactRow`: kreska 1 px nad krokiem, numer mono
 * (jedyna numeracja na stronie głównej, bo to faktyczna kolejność), tytuł `h3` w roli title,
 * opis `--muted`. Siatka 1 → 2 (640 px) → 4 kolumny (1024 px); kroki dzielą wiersze przez subgrid,
 * więc numery, tytuły i opisy stoją w rzędzie w jednej linii. Hover (tylko myszą): limonkowe tło kolumny
 * i treść wcięta o 12 px, jak w `FaqSection`; na limonce w tle pojawia się duży numer kroku. Gdy lista jest w widoku
 * (górna krawędź nad 60% wysokości okna), kroki podświetlają się po kolei w pętli (`.active`: to samo co hover, także
 * na dotyku); po wyjściu z widoku przebieg gaśnie. Hover ma pierwszeństwo (CSS). Bez przycisku pauzy (decyzja
 * projektowa; cykl 5,6 s przekracza próg WCAG 2.2.2). Przy reduced motion przebiegu nie ma. Nic nie jest fokusowalne.
 * Client Component, dane z propsów.
 */
export function ProcessSection({ id, label, steps, tone = "light", className }: ProcessSectionProps) {
  const headingId = `${id}-heading`;
  const listRef = useRef<HTMLOListElement>(null);
  const active = useSweep(listRef, steps.length, { stepMs: SWEEP_STEP_MS, delayMs: SWEEP_DELAY_MS, loop: true });

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
      <ol ref={listRef} className={styles.steps}>
        {steps.map((step, i) => (
          <li key={step.no} className={cx(styles.step, i === active && styles.active)}>
            <span className={cx("mono", styles.no)} aria-hidden="true">
              {step.no}
            </span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
            <span className={styles.ghost} aria-hidden="true">
              {step.no}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
