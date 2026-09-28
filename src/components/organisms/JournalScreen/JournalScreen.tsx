"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type UIEvent } from "react";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { cx } from "@/lib/cx";
import styles from "./JournalScreen.module.css";

/** Wpisy tygodnia 39 (treść przykładowa, układ 1:1 z `journal-v2-screen.tsx`). */
const DAYS = [
  { day: 27, weekday: "sobota", title: "Rozmowa z Herodotem", live: true },
  { day: 26, weekday: "piątek", title: "Tydzień zamknięty bez nadgodzin", preview: "Pierwszy raz od miesiąca wyszłam o 17 i nic się nie zawaliło" },
  { day: 24, weekday: "środa", title: "Rozmowa o granicach", preview: "Powiedziałam „nie” na spotkanie, które mogło być mailem" },
  { day: 22, weekday: "poniedziałek", title: "Plan na tydzień", preview: "Trzy priorytety zamiast dziesięciu" },
] as const;

const TOAST_MS = 1600;
/** Hero zwija się z 304 do 144 pt (skala ekranu 390 pt), jak w appce. */
const HERO_COLLAPSE = 160;

export interface JournalScreenProps {
  className?: string;
}

/**
 * Klikalny ekran Dziennika AION MIND odtworzony w HTML na podstawie `journal-v2-screen.tsx`
 * (automationhouse/AION, main, 28.09.2026):
 * - hero z kartą miesiąca zwija się przy przewijaniu listy wpisów,
 * - panel tygodnia z pierścieniem priorytetów,
 * - karta podsumowania tygodnia: przycisk `aria-pressed`, komunikat w `role="status"`.
 * Kolory to paleta pory „dzień” z `day-palettes.ts`; to ekran aplikacji, nie UI strony.
 * Client Component.
 */
export function JournalScreen({ className }: JournalScreenProps) {
  const [collapse, setCollapse] = useState(0);
  const [summarized, setSummarized] = useState(false);
  const [toast, setToast] = useState({ text: "", on: false });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const unit = el.clientWidth / 390;
    setCollapse(Math.min(1, el.scrollTop / (HERO_COLLAPSE * unit)));
  };

  const onSummary = () => {
    const next = !summarized;
    setSummarized(next);
    setToast({ text: next ? "Podsumowanie tygodnia 39 gotowe" : "Podsumowanie cofnięte", on: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), TOAST_MS);
  };

  return (
    <PhoneFrame className={cx(styles.phone, className)}>
      <div className={styles.jr} role="group" aria-label="Dziennik, wrzesień 2026" style={{ "--c": collapse } as CSSProperties}>
        <div className={styles.hero}>
          <Image
            className={styles.heroImg}
            src="/assets/aion-mind/journal-september.jpg"
            alt=""
            width={900}
            height={675}
            sizes="320px"
          />
          <div className={styles.nav} aria-hidden="true">
            <i>
              <svg viewBox="0 0 24 24">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16M9 3v4M15 3v4" />
              </svg>
            </i>
            <i>
              <svg viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
          </div>
          <div className={styles.heroBar}>
            <b>„Wrzesień”</b>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
              </svg>
              Podsumuj miesiąc
            </span>
          </div>
        </div>

        <div className={styles.body} onScroll={onScroll} tabIndex={0} aria-label="Wpisy z tygodnia 39">
          <div className={styles.week}>
            <svg className={styles.ring} viewBox="0 0 56 56" aria-hidden="true">
              <circle cx="28" cy="28" r="24" className={styles.ringBg} />
              <circle cx="28" cy="28" r="24" className={styles.ringArc} transform="rotate(-90 28 28)" />
            </svg>
            <div>
              <strong>Tydzień 39</strong>
              <small>22–28 wrz</small>
            </div>
            <span className={styles.priorities}>Priorytety: 2/3 ›</span>
          </div>

          <ol className={styles.entries}>
            {DAYS.map((d) => (
              <li key={d.day}>
                <div className={styles.dayHead}>
                  <b>{d.day}</b>
                  <span>{d.weekday}</span>
                </div>
                <div className={cx(styles.entry, "live" in d && styles.entryLive)}>
                  <strong>{d.title}</strong>
                  {"live" in d ? (
                    <small className={styles.liveLabel}>Rozmowa w toku</small>
                  ) : (
                    <small>{d.preview}</small>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className={cx(styles.summary, summarized && styles.summaryDone)}>
            <small>Podsumowanie tygodnia 39 · 22–28 wrz</small>
            <strong>{summarized ? "Tydzień podsumowany" : "Ten tydzień czeka na podsumowanie"}</strong>
            <p>{summarized ? "Trzy wnioski i jeden priorytet na kolejny tydzień." : "Zatrzymaj to, co było ważne."}</p>
            <button type="button" aria-pressed={summarized} onClick={onSummary}>
              {summarized ? "Zobacz podsumowanie tygodnia →" : "Podsumuj tydzień →"}
            </button>
          </div>
        </div>

        <div className={cx(styles.toast, toast.on && styles.toastOn)} role="status">
          {toast.text}
        </div>
      </div>
    </PhoneFrame>
  );
}
