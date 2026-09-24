"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/cx";
import { computeSplit, formatZl, type SplitModel } from "./split";
import styles from "./SplitCalculator.module.css";

const MODELS: readonly { id: SplitModel; label: string }[] = [
  { id: "prop", label: "Proporcjonalnie" },
  { id: "half", label: "50 / 50" },
  { id: "none", label: "Tylko śledzenie" },
];

interface SliderConfig {
  key: "a" | "b" | "total";
  label: string;
  min: number;
  max: number;
}

const SLIDERS: readonly SliderConfig[] = [
  { key: "a", label: "Dochód Anny", min: 2000, max: 20000 },
  { key: "b", label: "Dochód Michała", min: 2000, max: 20000 },
  { key: "total", label: "Wspólne wydatki", min: 500, max: 12000 },
];

const INITIAL = { a: 6500, b: 4500, total: 4000 } as const;

export interface SplitCalculatorProps {
  className?: string;
}

/**
 * Działający kalkulator podziału OurMoney (legacy `#calc`): trzy modele (przyciski
 * `aria-pressed`), trzy suwaki z `<label>` i `<output>`, pasek wyniku w `aria-live`.
 * Client Component (stan). Stan początkowy = copy z podpisu (59% i 2 360 zł).
 */
export function SplitCalculator({ className }: SplitCalculatorProps) {
  const uid = useId();
  const [model, setModel] = useState<SplitModel>("prop");
  const [values, setValues] = useState<Record<SliderConfig["key"], number>>(INITIAL);
  const result = computeSplit(model, values.a, values.b, values.total);
  const none = result.percentA === null;

  return (
    <div className={cx("mono-sm", styles.calc, className)}>
      <div className={styles.models} role="group" aria-label="Model podziału">
        {MODELS.map((m) => (
          <button key={m.id} type="button" aria-pressed={model === m.id} onClick={() => setModel(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {SLIDERS.map((s) => {
        const id = `${uid}-${s.key}`;
        const text = formatZl(values[s.key]);
        return (
          <div key={s.key} className={styles.field}>
            <label htmlFor={id}>{s.label}</label>
            <output htmlFor={id} className={styles.out}>
              {text}
            </output>
            <input
              id={id}
              type="range"
              min={s.min}
              max={s.max}
              step={100}
              value={values[s.key]}
              aria-valuetext={text}
              onChange={(e) => {
                const v = Number(e.currentTarget.value);
                setValues((prev) => ({ ...prev, [s.key]: v }));
              }}
            />
          </div>
        );
      })}

      <div className={styles.bar} aria-live="polite" aria-atomic="true">
        <div className={styles.a} style={{ flexBasis: `${result.barA}%` }}>
          <span>Anna · {none ? "—" : `${result.percentA}%`}</span>
          <strong>{result.shareA === null ? "każde swoje" : formatZl(result.shareA)}</strong>
        </div>
        <div className={styles.b} style={{ flexBasis: `${100 - result.barA}%` }}>
          <span>Michał · {none ? "—" : `${100 - (result.percentA ?? 0)}%`}</span>
          <strong>{result.shareB === null ? "każde swoje" : formatZl(result.shareB)}</strong>
        </div>
      </div>
    </div>
  );
}
