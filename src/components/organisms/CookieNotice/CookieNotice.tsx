"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Button } from "@/components/atoms/Button";
import { Mark } from "@/components/atoms/Mark";
import { Tally } from "@/components/molecules/Tally";
import { cookieNotice } from "@/content/legal";
import { cx } from "@/lib/cx";
import { useIntroDone } from "@/lib/hooks/useIntroDone";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import styles from "./CookieNotice.module.css";
import { dismissNotice, isNoticeDismissed, subscribeNotice } from "./notice-store";

/** Po starcie wejścia hero ma swoją chwilę; komunikat wjeżdża dopiero potem. */
const SHOW_DELAY_MS = 1200;
/** Czas wyjazdu (`.leaving` w CSS). */
const LEAVE_MS = 300;

/** Serwer i hydratacja: nic nie renderujemy (stan zamknięcia jest tylko w przeglądarce). */
const serverDismissed = () => true;

/**
 * Komunikat o ciasteczkach w chrome (`layout.tsx`): ciemna karta w lewym dolnym rogu (na telefonie na całą
 * szerokość), limonkowe „Zero” w tytule, paragon `Tally`, w którym liczniki odliczają do 0 (CSS `@property`),
 * przycisk „Jasne” i link do polityki. Strona nie ustawia ciasteczek, więc to informacja, nie zgoda:
 * bez „Odrzuć” i bez blokowania strony (nie łapie fokusu, Esc zamyka).
 *
 * Pojawia się po starcie wejścia + `SHOW_DELAY_MS`, jeśli `localStorage` nie ma bieżącej wersji
 * (`notice-store.ts`). Zamknięcie: wpis w `localStorage`, wyjazd `LEAVE_MS` (bez ruchu od razu), fokus
 * wraca na `<main>`, gdy był w komunikacie. Client Component.
 */
export function CookieNotice() {
  const dismissed = useSyncExternalStore(subscribeNotice, isNoticeDismissed, serverDismissed);
  const introDone = useIntroDone();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const titleId = useId();
  const noticeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (dismissed || !introDone) return;
    const timer = window.setTimeout(() => setReady(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [dismissed, introDone]);

  if (dismissed || !ready) return null;

  const close = () => {
    if (leaving) return;
    if (noticeRef.current?.contains(document.activeElement)) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    setLeaving(true);
    window.setTimeout(dismissNotice, reduced ? 0 : LEAVE_MS);
  };

  return (
    <section
      ref={noticeRef}
      className={cx("tone-dark", styles.notice, leaving && styles.leaving)}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <p className={cx("mono-sm", styles.label)}>{cookieNotice.label}</p>
      <h2 id={titleId} className={styles.title}>
        <Mark>{cookieNotice.title.mark}</Mark> {cookieNotice.title.rest}
      </h2>
      <Tally
        className={styles.tally}
        ariaLabel={cookieNotice.tallyLabel}
        rows={cookieNotice.rows.map((row) => ({
          label: row.label,
          value: (
            <>
              <span className={styles.count} style={{ "--from": row.from } as CSSProperties} aria-hidden="true" />
              <span className="sr-only">{row.value}</span>
            </>
          ),
        }))}
      />
      <p className={styles.text}>{cookieNotice.text}</p>
      <div className={styles.actions}>
        <Button onClick={close}>{cookieNotice.accept}</Button>
        <ArrowLink href={cookieNotice.more.href} variant="underline" arrow={null} className={styles.more}>
          {cookieNotice.more.label}
        </ArrowLink>
      </div>
    </section>
  );
}
