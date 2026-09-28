"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { cx } from "@/lib/cx";
import styles from "./AmphitheatreScreen.module.css";

/** Etapy 1:1 z `three-stage-amphitheatre-screen.tsx`; pytania i opisy przykładowe. */
const STAGES = [
  {
    tab: "Wartości",
    guide: "herodot",
    question: "Co jest dla Ciebie ważne, gdy nikt nie patrzy?",
    note: "Herodot zbierze to w rozmowie i zapisze tutaj.",
    unlocks: "Strateg",
  },
  {
    tab: "Kierunek",
    guide: "strateg",
    question: "Dokąd zmierzasz i po czym poznasz, że jesteś bliżej?",
    note: "Wizja, cel i to, co Cię od niego oddziela.",
    unlocks: "Empatia",
  },
  {
    tab: "Otoczenie",
    guide: "empatia",
    question: "Kto i co wokół Ciebie dodaje Ci energii, a co ją zabiera?",
    note: "Relacje, miejsca i nawyki, które Cię kształtują.",
    unlocks: "Kowal Produktywności",
  },
] as const;

/** Ilustracja hero zależy od liczby ukończonych etapów (`initial`, `stage-1…3`). */
const HERO = ["initial", "stage-1", "stage-2", "stage-3"] as const;
/** Pozycje znaczników na ilustracji (ułamki szerokości i wysokości hero) z kodu appki. */
const MARKERS = [
  [0.31, 0.57],
  [0.5, 0.43],
  [0.69, 0.57],
] as const;
const TOAST_MS = 1800;

export interface AmphitheatreScreenProps {
  className?: string;
}

/**
 * Klikalny ekran Amfiteatru Wiedzy odtworzony z `three-stage-amphitheatre-screen.tsx`
 * (automationhouse/AION, main, 28.09.2026): trzy etapy, znaczniki na ilustracji,
 * zakładki i przycisk „Uzupełnij z przewodnikiem”. Ukończenie etapu zmienia ilustrację,
 * złoci znacznik i ogłasza odblokowanego przewodnika w `role="status"`.
 * Client Component.
 */
export function AmphitheatreScreen({ className }: AmphitheatreScreenProps) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [toast, setToast] = useState({ text: "", on: false });
  const timer = useRef<number | undefined>(undefined);
  const completed = done.filter(Boolean).length;
  const stage = STAGES[active];
  const allDone = completed === STAGES.length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const complete = () => {
    if (allDone) {
      setDone([false, false, false]);
      setActive(0);
      return;
    }
    if (done[active]) {
      setActive(done.findIndex((d) => !d));
      return;
    }
    setDone((prev) => prev.map((d, i) => d || i === active));
    setToast({ text: `Etap ukończony. Odblokowano: ${stage.unlocks}`, on: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), TOAST_MS);
  };

  const label = allDone ? "Zacznij od nowa" : done[active] ? "Przejdź do kolejnego etapu" : "Uzupełnij z przewodnikiem";

  return (
    <PhoneFrame className={cx(styles.phone, className)}>
      <div className={styles.amf} role="group" aria-label="Amfiteatr Wiedzy">
        <div className={styles.hero}>
          {HERO.map((src, i) => (
            <Image
              key={src}
              className={cx(styles.heroImg, i === completed && styles.heroOn)}
              src={`/assets/aion-mind/amf-${src}.jpg`}
              alt=""
              width={976}
              height={729}
              sizes="320px"
            />
          ))}
          {MARKERS.map(([x, y], i) => (
            <button
              key={i}
              type="button"
              className={cx(styles.marker, done[i] && styles.markerDone, i === active && styles.markerOn)}
              style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
              aria-label={`Etap ${i + 1}: ${STAGES[i].tab}${done[i] ? ", ukończony" : ""}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              {i + 1}
            </button>
          ))}
          <div className={styles.me} aria-hidden="true">
            M
          </div>
          <div className={styles.meName}>Magda</div>
        </div>

        <div className={styles.sheet}>
          <div className={styles.tabs} role="tablist" aria-label="Etapy">
            {STAGES.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={cx(styles.tab, i === active && styles.tabOn)}
                onClick={() => setActive(i)}
              >
                {s.tab}
              </button>
            ))}
          </div>

          <div className={styles.content} role="tabpanel" aria-label={stage.tab}>
            <small>
              Etap {active + 1} z {STAGES.length}
            </small>
            <div className={styles.title}>
              <strong>{stage.tab}</strong>
              <Image
                className={styles.coin}
                src={`/assets/aion-mind/guide-${stage.guide}.jpg`}
                alt=""
                width={480}
                height={480}
                sizes="60px"
              />
            </div>
            <p>{stage.question}</p>
            <p className={styles.note}>{stage.note}</p>
            <button type="button" className={cx(styles.cta, done[active] && !allDone && styles.ctaDone)} onClick={complete}>
              {label}
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
