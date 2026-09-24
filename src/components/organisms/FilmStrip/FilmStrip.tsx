"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import styles from "./FilmStrip.module.css";

export interface FilmFrame {
  image: Required<CaseStudyImage>;
  /** Pogrubiony podpis po lewej, np. marka. */
  title: string;
  /** Podpis po prawej, np. reżyser. */
  meta: string;
}

export interface FilmStripProps {
  frames: readonly FilmFrame[];
  /** Nazwa grupy dla czytników, np. „Stories”. */
  ariaLabel: string;
  /** Co ile ms taśma sama przechodzi do następnej klatki (legacy 3200). `0` = wyłączone. */
  autoAdvanceMs?: number;
  className?: string;
}

/** Próg (px), po którym wciśnięcie myszy staje się przeciąganiem, a nie kliknięciem. */
const DRAG_THRESHOLD = 6;

/**
 * Taśma filmowa (legacy `.film` z case-busybee-v3): klatki w poziomym scrollu ze snapem,
 * perforacja u góry i u dołu.
 *
 * - Mysz: przeciąganie taśmy (Pointer Events, capture dopiero po 6 px, więc klik działa).
 * - Dotyk / trackpad / Shift+kółko: natywny poziomy scroll. `data-lenis-prevent`, bo Lenis
 *   blokowałby poziomy gest trackpada z niezerowym `deltaY`; pionowe kółko nad taśmą
 *   przewija wtedy stronę natywnie (bez wygładzania).
 * - Klawiatura: ← → Home End między klatkami (fokus + wyśrodkowanie).
 * - Klik w klatkę: wyróżnienie (`aria-pressed`) i wyśrodkowanie.
 * - Autoprzewijanie co 3,2 s, gdy taśma jest w widoku (IntersectionObserver 0.4);
 *   pauza na hover, fokus i interakcję; brak przy `prefers-reduced-motion`.
 * - Przycisk „Pauza” / „Wznów” w prawym górnym rogu (WCAG 2.2.2, zmienna etykieta bez `aria-pressed`):
 *   pauza z przycisku jest trwała (nie kończy się po zdjęciu kursora ani wyjeździe z widoku).
 *
 * Client Component. Obrazy przez `next/image` (`fill`, `sizes` jak szerokość klatki).
 */
export function FilmStrip({ frames, ariaLabel, autoAdvanceMs = 3200, className }: FilmStripProps) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  /* Pauza wybrana przyciskiem: trwała, aż użytkownik sam wznowi. */
  const [paused, setPaused] = useState(false);
  const autoplay = !reduced && autoAdvanceMs > 0 && frames.length >= 2;
  const stripRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const drag = useRef({ down: false, captured: false, startX: 0, startScroll: 0, moved: 0, pointerId: -1 });
  const currentRef = useRef(0);
  /* Pauza autoprzewijania: kursor nad taśmą, fokus w środku albo interakcja
     (jak w legacy: po dotknięciu stoi, dopóki taśma nie wyjdzie z widoku). */
  const pause = useRef({ hover: false, focus: false, interacted: false });

  /** Wyśrodkowuje klatkę w taśmie bez przewijania strony (w legacy `scrollIntoView`). */
  const center = useCallback(
    (index: number) => {
      const strip = stripRef.current;
      const frame = frameRefs.current[index];
      if (!strip || !frame) return;
      const left = frame.offsetLeft - (strip.clientWidth - frame.offsetWidth) / 2;
      strip.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const select = useCallback(
    (index: number, focus = false) => {
      const next = (index + frames.length) % frames.length;
      currentRef.current = next;
      setCurrent(next);
      center(next);
      if (focus) frameRefs.current[next]?.focus({ preventScroll: true });
    },
    [center, frames.length],
  );

  /* Autoprzewijanie tylko w widoku i bez reduced motion. */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !autoplay || paused) return;
    let timer: number | undefined;
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      timer = window.setInterval(() => {
        const p = pause.current;
        if (p.hover || p.focus || p.interacted) return;
        select(currentRef.current + 1);
      }, autoAdvanceMs);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start();
        } else {
          stop();
          pause.current.interacted = false;
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(strip);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [autoplay, paused, autoAdvanceMs, select]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pause.current.interacted = true;
    if (event.pointerType === "touch" || event.button !== 0) return;
    const strip = stripRef.current;
    if (!strip) return;
    drag.current = {
      down: true,
      captured: false,
      startX: event.clientX,
      startScroll: strip.scrollLeft,
      moved: 0,
      pointerId: event.pointerId,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const strip = stripRef.current;
    if (!d.down || !strip || event.pointerId !== d.pointerId) return;
    const dx = event.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (!d.captured && d.moved > DRAG_THRESHOLD) {
      d.captured = true;
      strip.setPointerCapture(event.pointerId);
      strip.dataset.drag = "";
    }
    if (d.captured) strip.scrollLeft = d.startScroll - dx;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const strip = stripRef.current;
    if (!d.down || event.pointerId !== d.pointerId) return;
    d.down = false;
    if (strip) {
      if (strip.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
      delete strip.dataset.drag;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: frames.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    pause.current.interacted = true;
    select(target, true);
  };

  return (
    <div className={cx(styles.film, className)}>
      {autoplay ? (
        <button
          type="button"
          className={cx("mono-sm", styles.pause)}
          data-paused={paused ? "" : undefined}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Wznów" : "Pauza"}
        </button>
      ) : null}
      <div
        ref={stripRef}
        className={styles.strip}
        role="group"
        aria-label={ariaLabel}
        data-lenis-prevent=""
        data-cursor="grab"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") pause.current.hover = true;
        }}
        onPointerLeave={() => {
          pause.current.hover = false;
        }}
        onFocus={() => {
          pause.current.focus = true;
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pause.current.focus = false;
        }}
        onKeyDown={onKeyDown}
        onClickCapture={(event) => {
          /* Po przeciągnięciu nie traktujemy puszczenia jako kliknięcia w klatkę. */
          if (drag.current.moved > DRAG_THRESHOLD) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = 0;
          }
        }}
      >
        {frames.map((frame, i) => (
          <button
            key={frame.image.src}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            type="button"
            className={styles.frame}
            aria-pressed={i === current}
            onClick={() => select(i)}
          >
            <Image
              className={styles.img}
              src={frame.image.src}
              alt={frame.image.alt}
              fill
              sizes="(min-width: 778px) 560px, 72vw"
              draggable={false}
            />
            <span className={cx("mono-sm", styles.caption)}>
              <b>{frame.title}</b>
              <span>{frame.meta}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
