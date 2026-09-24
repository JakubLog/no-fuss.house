"use client";

import { useId, useState, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./FussSlider.module.css";

export interface FussSliderProps {
  /** Wywoływane przy każdej zmianie, wartość 0–1. Nie powoduje re-renderu rodzica. */
  onValueChange: (value: number) => void;
  /** Wartość startowa 0–100. Domyślnie 0 (porządek). */
  defaultValue?: number;
  /** Etykieta widoczna. Domyślnie „Zamieszanie”. */
  label?: string;
  /** Opis dla czytników ekranu (`aria-describedby`). */
  hint?: string;
  className?: string;
  style?: CSSProperties;
}

const format = (value: number) => `${String(value).padStart(3, "0")}%`;

/**
 * Suwak „Zamieszanie” (legacy `.fuss`): etykieta mono, tor 2 px, uchwyt-romb w akcencie,
 * odczyt `000%`. Wyłącza naklejki kursora nad sobą (`data-no-stickers`). Client Component.
 */
export function FussSlider({
  onValueChange,
  defaultValue = 0,
  label = "Zamieszanie",
  hint,
  className,
  style,
}: FussSliderProps) {
  const id = useId();
  const inputId = `${id}-range`;
  const hintId = `${id}-hint`;
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={cx("mono-sm", styles.fuss, className)} style={style} data-no-stickers="">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={styles.range}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-valuetext={`${value}%`}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => {
          const next = Number(event.currentTarget.value);
          setValue(next);
          onValueChange(next / 100);
        }}
      />
      <output htmlFor={inputId} className={styles.out}>
        {format(value)}
      </output>
      {hint ? (
        <span className="sr-only" id={hintId}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
