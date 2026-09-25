"use client";

import { useEffect, useRef, useState } from "react";
import { isIntroDone, markIntroDone } from "@/lib/intro";
import { cx } from "@/lib/cx";
import styles from "./Preloader.module.css";

type Phase = "loading" | "done" | "removed";

/** Pasek trwa co najmniej tyle, nawet gdy fonty są już w cache (bez mignięcia). */
const MIN_MS = 600;
/** Twardy limit: po tym czasie kurtyna rusza, nawet jeśli `document.fonts.ready` nie przyszło. */
const MAX_MS = 1200;
/** Dobieg paska do 100% po gotowości fontów. */
const FILL_MS = 180;
/** Kurtyna jedzie 1 s, element znika z DOM po 1,2 s (legacy). */
const REMOVE_AFTER_MS = 1200;
/** Treść pod kurtyną (elementy root layoutu): `inert`, dopóki kurtyna zasłania. */
const COVERED_SELECTOR = ".skip-link, body > header, body > main, body > footer";

const easeOut = (x: number) => 1 - (1 - x) * (1 - x);

/**
 * Preloader: pasek 110×4 na środku (limonka na 25% bieli), po wypełnieniu kurtyna
 * odjeżdża w górę, potem `markIntroDone()` odpala reveal hero (Reveal `trigger="intro"`).
 *
 * Czeka na `document.fonts.ready` (nie na `window.load`): pasek trwa od 600 ms
 * do 1200 ms (twardy limit zamiast timeoutu na fonty).
 *
 * Działa tylko przy pierwszym wejściu: żyje w root layout, który nie montuje się
 * ponownie przy nawigacji klienckiej; gdyby jednak się zamontował po intro
 * (`isIntroDone()`), od razu znika. Przy `prefers-reduced-motion` nie pokazuje się wcale
 * (CSS `display: none` od pierwszej klatki, także przed hydratacją), a `markIntroDone()`
 * idzie od razu. Na czas paska skip link, HUD, `main` i stopka mają `inert` (Tab nie chodzi
 * pod kurtyną); zdejmowany w `finish`, najpóźniej po `MAX_MS` i w cleanupie.
 * Blokadę scrolla robi `body:has([data-preloader="active"])` w globals.css,
 * bez JS chowa go `<noscript>` w layoucie. Client Component.
 */
export function Preloader() {
  /* Przy hydratacji zawsze `false` (jak na serwerze), więc bez mismatchu. */
  const [phase, setPhase] = useState<Phase>(() => (isIntroDone() ? "removed" : "loading"));
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIntroDone() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markIntroDone();
      const raf = requestAnimationFrame(() => setPhase("removed"));
      return () => cancelAnimationFrame(raf);
    }

    const fill = fillRef.current;
    const start = performance.now();
    /** Czas (ms od startu), w którym fonty były gotowe; `null` = jeszcze nie. */
    let readyAt: number | null = null;
    let progress = 0;
    let raf = 0;
    let removeTimer = 0;
    let cancelled = false;

    /*
     * Tylko elementy, które `inert` dostały tutaj; zdjęcie jest idempotentne. Timer to
     * bezpiecznik: gdy rAF stoi (karta w tle, zawieszony wątek), treść i tak odblokuje się po MAX_MS.
     */
    const covered = Array.from(document.querySelectorAll<HTMLElement>(COVERED_SELECTOR)).filter((el) => !el.inert);
    for (const el of covered) el.inert = true;
    const uncover = () => {
      for (const el of covered) el.inert = false;
    };
    const uncoverTimer = window.setTimeout(uncover, MAX_MS);

    const fonts = typeof document.fonts === "undefined" ? null : document.fonts;
    if (!fonts || fonts.status === "loaded") {
      readyAt = 0;
    } else {
      fonts.ready.then(
        () => {
          if (!cancelled && readyAt === null) readyAt = performance.now() - start;
        },
        () => {
          if (!cancelled && readyAt === null) readyAt = performance.now() - start;
        },
      );
    }

    const finish = () => {
      uncover();
      setPhase("done");
      markIntroDone();
      removeTimer = window.setTimeout(() => setPhase("removed"), REMOVE_AFTER_MS);
    };

    /*
     * Koniec paska: gotowość fontów + krótki dobieg, w granicach 600–1200 ms.
     * Dopóki fonty nie są gotowe, pasek idzie tak, by dojść do 100% w 1200 ms;
     * gdy są, przyspiesza (postęp tylko rośnie).
     */
    const step = (now: number) => {
      const elapsed = now - start;
      const endAt = readyAt === null ? MAX_MS : Math.min(MAX_MS, Math.max(MIN_MS, readyAt + FILL_MS));
      progress = Math.max(progress, easeOut(Math.min(1, elapsed / endAt)));
      if (fill) fill.style.transform = `scaleX(${progress})`;
      if (elapsed < endAt) raf = requestAnimationFrame(step);
      else finish();
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(removeTimer);
      window.clearTimeout(uncoverTimer);
      uncover();
    };
  }, []);

  if (phase === "removed") return null;

  return (
    <div
      className={cx(styles.preloader, phase === "done" && styles.done)}
      data-preloader={phase === "loading" ? "active" : "done"}
      aria-hidden="true"
    >
      <div className={styles.bar}>
        <div ref={fillRef} className={styles.fill} />
      </div>
    </div>
  );
}
