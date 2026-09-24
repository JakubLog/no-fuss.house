"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { cx } from "@/lib/cx";
import { JOURNAL_DAYS, JOURNAL_INITIAL_INDEX, WEEKDAYS, dayLabel, weekOf } from "./journal";
import styles from "./JournalScreen.module.css";

const CARDS = [
  {
    id: "month",
    tone: "month",
    title: "Podsumowanie miesiąca",
    text: "Zobacz jakie były wzorce, wnioski albo momenty przełomu w tym miesiącu",
    message: "Podsumowanie miesiąca: wzorce, wnioski i momenty przełomu",
  },
  {
    id: "week",
    tone: "week",
    title: "Podsumowanie tygodnia",
    text: "Zobacz jak Ci minął ten tydzień.",
    message: "Podsumowanie tygodnia: jak Ci minął ten tydzień",
  },
] as const;

type CardId = (typeof CARDS)[number]["id"];

const TOAST_MS = 1600;
const ROWS = Array.from({ length: JOURNAL_DAYS.length / 7 }, (_, r) => JOURNAL_DAYS.slice(r * 7, r * 7 + 7));

export interface JournalScreenProps {
  className?: string;
}

/**
 * Klikalny ekran Dziennika AION MIND odtworzony w HTML (legacy `#jr`).
 * - kalendarz: ARIA `grid` (wiersze = tygodnie), roving tabindex, strzałki / Home / End,
 *   Enter / Spacja / klik wybiera dzień i przestawia „Tydzień N” + zakres dat,
 * - karty podsumowań: przyciski `aria-pressed`, komunikat w `role="status"` (toast 1,6 s).
 * Kolory, zaokrąglenia i drobne rozmiary to odtworzony ekran aplikacji, nie UI strony.
 * Client Component.
 */
export function JournalScreen({ className }: JournalScreenProps) {
  const uid = useId();
  const monthId = `${uid}-month`;
  const [selected, setSelected] = useState(JOURNAL_INITIAL_INDEX);
  const [focused, setFocused] = useState(JOURNAL_INITIAL_INDEX);
  const [pressed, setPressed] = useState<Record<CardId, boolean>>({ month: false, week: false });
  const [toast, setToast] = useState({ text: "", on: false });
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const week = weekOf(selected);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const moveFocus = (next: number) => {
    const i = Math.max(0, Math.min(JOURNAL_DAYS.length - 1, next));
    setFocused(i);
    buttons.current[i]?.focus();
  };

  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rowStart = focused - (focused % 7);
    const moves: Partial<Record<string, number>> = {
      ArrowRight: focused + 1,
      ArrowLeft: focused - 1,
      ArrowDown: focused + 7,
      ArrowUp: focused - 7,
      Home: e.ctrlKey ? 0 : rowStart,
      End: e.ctrlKey ? JOURNAL_DAYS.length - 1 : rowStart + 6,
    };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    moveFocus(next);
  };

  const onCard = (id: CardId, message: string) => {
    setPressed((prev) => ({ ...prev, [id]: !prev[id] }));
    setToast({ text: message, on: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), TOAST_MS);
  };

  return (
    <PhoneFrame className={cx(styles.phone, className)}>
      <div className={styles.jr} role="group" aria-label="Dziennik, maj 2026">
        <div className={styles.bar}>
          <i aria-hidden="true">‹</i>
          <span>Dziennik</span>
          <i aria-hidden="true">⌕</i>
          <i aria-hidden="true">✎</i>
        </div>
        <div className={styles.month} id={monthId}>
          Maj 2026
        </div>

        <div className={styles.grid} role="grid" aria-labelledby={monthId} onKeyDown={onGridKey}>
          <div className={styles.row} role="row">
            {WEEKDAYS.map((w) => (
              <span key={w.short} role="columnheader" className={styles.weekday}>
                <span aria-hidden="true">{w.short}</span>
                <span className="sr-only">{w.long}</span>
              </span>
            ))}
          </div>
          {ROWS.map((row, r) => (
            <div key={row[0].key} className={styles.row} role="row">
              {row.map((d, c) => {
                const i = r * 7 + c;
                const isSelected = i === selected;
                return (
                  <div
                    key={d.key}
                    role="gridcell"
                    aria-selected={isSelected}
                    className={cx(
                      styles.cell,
                      d.out && styles.out,
                      d.has && styles.has,
                      d.done && styles.done,
                      d.wait && styles.wait,
                      isSelected && styles.selected,
                    )}
                  >
                    <button
                      ref={(el) => {
                        buttons.current[i] = el;
                      }}
                      type="button"
                      className={styles.day}
                      tabIndex={i === focused ? 0 : -1}
                      aria-label={dayLabel(d)}
                      onFocus={() => setFocused(i)}
                      onClick={() => {
                        setSelected(i);
                        setFocused(i);
                      }}
                    >
                      {d.day}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {CARDS.map((card, i) => (
          <div key={card.id} className={styles.stack}>
            {i === 1 ? (
              <div className={styles.week} aria-live="polite" aria-atomic="true">
                <span>{week.title}</span>
                <small>{week.range}</small>
              </div>
            ) : null}
            <button
              type="button"
              className={cx(styles.card, card.tone === "month" ? styles.cardMonth : styles.cardWeek)}
              aria-pressed={pressed[card.id]}
              onClick={() => onCard(card.id, card.message)}
            >
              <strong>{card.title}</strong>
              <small className={styles.cardText}>{card.text}</small>
              <span>Przejrzyj podsumowanie</span>
            </button>
          </div>
        ))}

        <div className={cx(styles.toast, toast.on && styles.toastOn)} role="status">
          {toast.text}
        </div>
      </div>
    </PhoneFrame>
  );
}
