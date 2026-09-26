"use client";

import { useEffect, useId, useRef } from "react";
import { cx } from "@/lib/cx";
import {
  STICKERS,
  STICKER_LAYER_ATTR,
  STICKER_ZONE_ATTR,
  stickerClassName,
} from "@/components/atoms/StickerLayer";
import { usePointerFine } from "@/lib/hooks/usePointerFine";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import styles from "./Cursor.module.css";

/** Opóźnienie podążania (DESIGN.md: lerp 0.18). */
const LERP = 0.18;
/** Minimalny dystans kursora między naklejkami (px). */
const STICKER_STEP = 170;
/** Maksymalna liczba naklejek naraz w jednej strefie. */
const MAX_STICKERS = 8;
/**
 * Elementy z własnym kursorem (np. `PhoneScroller` z `ns-resize`, żywa ramka `LiveFrame`):
 * nad nimi chowamy strzałkę, zostaje kursor systemowy (bez podwójnego kursora).
 */
const NATIVE_CURSOR_SELECTOR = "[data-native-cursor]";
/** Elementy przeciągalne (FilmStrip, DragBall, naklejki StickerBoard): stan `grab`, ma pierwszeństwo przed `link`. */
const GRAB_SELECTOR = '[data-cursor="grab"]';
/** Pytanie FAQ (`summary`): krążek z „?”, przy otwartym `details` z „−”. */
const HELP_SELECTOR = '[data-cursor="help"]';
/** Link do kalendarza („Umów rozmowę ↗”): krążek z ikoną kalendarza. */
const CALENDAR_SELECTOR = '[data-cursor="calendar"]';
/** Elementy interaktywne: stan `link` (strzałka zmienia się w pierścień). */
const LINK_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  "label",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "summary",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");
/** Połowa boku SVG: punkt wskaźnika leży w środku (grot strzałki i środek pierścienia). */
const HALF = 44;

type CursorState = "arrow" | "link" | "grab" | "help" | "calendar";
/** Ton kursora: `accent` = ciemny wariant nad limonkowym tłem, `base` = limonkowy. */
type CursorTone = "base" | "accent";

/**
 * Limonkowa strzałka podążająca za kursorem (lerp 0.18) + naklejki w strefach
 * `data-stickers`. Tylko `(pointer: fine)`, wyłączona przy reduced motion.
 * Stany (`data-state` na SVG, bez re-renderów Reacta): `arrow`; `link` nad elementem
 * interaktywnym (strzałka → limonkowy pierścień); `grab` nad `[data-cursor="grab"]`
 * (mała pełna kropka, przy wciśnięciu `data-pressed` ściska się); `help` nad
 * `[data-cursor="help"]` (krążek z „?”, `data-open` → „−”); `calendar` nad
 * `[data-cursor="calendar"]` (krążek z ikoną kalendarza).
 * Ton (`data-tone`): nad limonkowym tłem (`--accent`) kursor ciemnieje. Tło to pierwsze nieprzezroczyste
 * `background-color` na stosie `elementsFromPoint` pod wskaźnikiem (plus `::before` wierzchniego elementu,
 * np. dzień w `EventTile`; zdjęcie / wideo / canvas wyżej = `base`). Liczone przy zmianie elementu, przy
 * przejściach `background-color` elementów ze stosu i raz po kliknięciu, nigdy co klatkę. Dla trwającego
 * przejścia bierze wartość końcową, więc hover wiersza nie czeka 0.4 s.
 * Ustawia `html[data-cursor="on"]` (ukrywa systemowy kursor). Nad `[data-native-cursor]`
 * i po wejściu wskaźnika do `iframe` (dokument nie dostaje wtedy `mousemove`) strzałka
 * się chowa, zamiast zamarzać na krawędzi. Client Component.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const cursorRef = useRef<SVGSVGElement>(null);
  const gradientId = `cursor-gradient-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;

    const root = document.documentElement;
    root.dataset.cursor = "on";

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let last = { x: 0, y: 0 };
    let index = 0;
    let raf = 0;

    const spawnSticker = (zone: Element) => {
      const layer = zone.querySelector<HTMLElement>(`[${STICKER_LAYER_ATTR}]`);
      if (!layer) return;
      const rect = zone.getBoundingClientRect();
      const el = document.createElement("div");
      el.className = stickerClassName;
      el.innerHTML = STICKERS[index++ % STICKERS.length] ?? "";
      el.style.left = `${tx - rect.left}px`;
      el.style.top = `${ty - rect.top}px`;
      el.style.setProperty("--s", `${Math.floor(72 + Math.random() * 48)}px`);
      el.style.setProperty("--r", `${Math.trunc(Math.random() * 50 - 25)}deg`);
      el.addEventListener("animationend", () => el.remove(), { once: true });
      layer.appendChild(el);
      if (layer.children.length > MAX_STICKERS) layer.firstElementChild?.remove();
    };

    const hide = () => {
      cursor.dataset.on = "false";
      cursor.dataset.pressed = "false";
    };

    /* Kolejność: grab → help → calendar → link. */
    const setState = (target: Element | null) => {
      let state: CursorState = "arrow";
      if (target?.closest(GRAB_SELECTOR)) state = "grab";
      else if (target?.closest(HELP_SELECTOR)) state = "help";
      else if (target?.closest(CALENDAR_SELECTOR)) state = "calendar";
      else if (target?.closest(LINK_SELECTOR)) state = "link";
      if (cursor.dataset.state !== state) cursor.dataset.state = state;
      /* Otwarte pytanie FAQ: „−” zamiast „?” (odświeża się przy następnym ruchu). */
      const open = state === "help" && target?.closest("details")?.open === true ? "true" : "false";
      if (cursor.dataset.open !== open) cursor.dataset.open = open;
    };

    /* Limonka jako rgb (`.cursor { color: var(--accent) }`), czytana raz: tak samo serializuje się `background-color`. */
    const accent = getComputedStyle(cursor).color;
    /* Ostatnie przejście `background-color` elementu / jego `::before` (z `transitionrun`). */
    const bgRuns = new WeakMap<Element, CSSTransition>();
    const beforeRuns = new WeakMap<Element, CSSTransition>();
    let toneTarget: Element | null = null;
    /* Co widać pod wskaźnikiem, od góry (także warstwy `fixed` bez tła, np. HUD); liczone raz na zmianę celu. */
    let stack: Element[] = [];

    /* Tło elementu; w trakcie przejścia jego wartość końcowa. */
    const backgroundOf = (el: Element, pseudo: "::before" | null) => {
      const run = (pseudo ? beforeRuns : bgRuns).get(el);
      if (run?.playState === "running") {
        const end = (run.effect as KeyframeEffect | null)?.getKeyframes().at(-1)?.backgroundColor;
        if (typeof end === "string") return end;
      }
      return getComputedStyle(el, pseudo).backgroundColor;
    };

    /* Pierwsze nieprzezroczyste tło na stosie decyduje; zdjęcie / wideo / canvas wyżej na stosie zasłania tło
       (np. scena `CaseStage` z obrazem na limonce), a koloru pikseli nie znamy, więc `base`. */
    const setTone = () => {
      let tone: CursorTone = "base";
      const top = stack[0];
      if (top && backgroundOf(top, "::before") === accent) tone = "accent";
      else {
        for (const node of stack) {
          if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) break;
          const bg = backgroundOf(node, null);
          /* Tło z alfą > 0 (`rgba(0, 0, 0, 0)` = przezroczyste). */
          if (bg !== "transparent" && !/^rgba\(.*,\s*0\)$/.test(bg)) {
            if (bg === accent) tone = "accent";
            break;
          }
        }
      }
      if (cursor.dataset.tone !== tone) cursor.dataset.tone = tone;
    };

    /* Ton liczony tylko przy zmianie elementu pod wskaźnikiem (nie na każdym `pointermove`): jeden hit-test.
       Współrzędne ze zdarzenia: `pointerover` przychodzi przed `pointermove`, więc `tx` / `ty` byłyby jeszcze stare. */
    const trackTone = (event: PointerEvent, target: Element | null) => {
      if (target === toneTarget) return;
      toneTarget = target;
      stack = target ? document.elementsFromPoint(event.clientX, event.clientY) : [];
      setTone();
    };

    /* Hover wiersza zmienia tło przejściem: `transitionrun` daje wartość końcową, `end` / `cancel` domyka stan. */
    const onTransition = (event: TransitionEvent) => {
      const el = event.target;
      if (event.propertyName !== "background-color" || !(el instanceof Element)) return;
      if (event.pseudoElement !== "" && event.pseudoElement !== "::before") return;
      const pseudo = event.pseudoElement === "::before" ? "::before" : null;
      if (event.type === "transitionrun") {
        const run = el
          .getAnimations({ subtree: pseudo !== null })
          .find(
            (a): a is CSSTransition =>
              a instanceof CSSTransition &&
              a.transitionProperty === "background-color" &&
              (a.effect as KeyframeEffect | null)?.pseudoElement === pseudo,
          );
        if (run) (pseudo ? beforeRuns : bgRuns).set(el, run);
      }
      if (pseudo ? el === stack[0] : stack.includes(el)) setTone();
    };

    /* `pointermove` zamiast `mousemove`: nie znika po `preventDefault()` na `pointerdown` (przeciąganie). */
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      tx = event.clientX;
      ty = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(NATIVE_CURSOR_SELECTOR)) {
        hide();
        return;
      }
      /* Po ukryciu strzałka pojawia się od razu pod kursorem, bez dojazdu ze starego miejsca. */
      if (cursor.dataset.on !== "true") {
        cx = tx;
        cy = ty;
      }
      if (!raf) raf = requestAnimationFrame(follow);
      cursor.dataset.on = "true";
      setState(target);
      trackTone(event, target);

      const zone = target?.closest(`[${STICKER_ZONE_ATTR}]`);
      if (zone && Math.hypot(tx - last.x, ty - last.y) > STICKER_STEP) {
        last = { x: tx, y: ty };
        spawnSticker(zone);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") cursor.dataset.pressed = "true";
    };
    /* Klik może zmienić tło bez przejścia (np. `aria-pressed` w `SplitCalculator`): jedno przeliczenie po klatce. */
    const onUp = () => {
      cursor.dataset.pressed = "false";
      requestAnimationFrame(setTone);
    };

    /* Po przewinięciu bez ruchu myszy pod wskaźnikiem może stać inny element (`pointermove` nie przychodzi). */
    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch" || cursor.dataset.on !== "true") return;
      const target = event.target instanceof Element ? event.target : null;
      setState(target);
      trackTone(event, target);
    };

    /* Wyjście z dokumentu albo wejście do `iframe` (relatedTarget `null` lub sam iframe). */
    const onOut = (event: MouseEvent) => {
      const next = event.relatedTarget;
      if (next === null || next instanceof HTMLIFrameElement) hide();
    };

    /* Pętla działa tylko, gdy strzałka dogania kursor; w spoczynku stoi (bez pracy co klatkę). */
    const follow = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      if (Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1) {
        cx = tx;
        cy = ty;
        raf = 0;
      } else {
        raf = requestAnimationFrame(follow);
      }
      cursor.style.translate = `${cx - HALF}px ${cy - HALF}px`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("transitionrun", onTransition, { passive: true });
    window.addEventListener("transitionend", onTransition, { passive: true });
    window.addEventListener("transitioncancel", onTransition, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(follow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("transitionrun", onTransition);
      window.removeEventListener("transitionend", onTransition);
      window.removeEventListener("transitioncancel", onTransition);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
      delete root.dataset.cursor;
      document.querySelectorAll(`[${STICKER_LAYER_ATTR}] > *`).forEach((n) => n.remove());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <svg
      ref={cursorRef}
      className={styles.cursor}
      viewBox="0 0 88 88"
      data-state="arrow"
      data-tone="base"
      data-pressed="false"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop className={styles.stopHi} offset="0" />
          <stop className={styles.stopMid} offset=".55" />
          <stop className={styles.stopLo} offset="1" />
        </linearGradient>
      </defs>
      {/* Grot strzałki (4,4) przesunięty do środka SVG (44,44) = punkt wskaźnika. */}
      <g transform="translate(40 40)">
        <path
          className={styles.arrow}
          d="M5 6.5c-.9-2 1-4 3-3.2l30 12.2c2.3.9 2.2 4.2-.2 4.9l-12.3 3.7c-.8.2-1.400.8-1.600 1.600l-3.7 12.3c-.7 2.400-4 2.500-4.900.2z"
          fill={`url(#${gradientId})`}
          stroke="#F4FFD6"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </g>
      <circle
        className={styles.ring}
        cx={HALF}
        cy={HALF}
        r={19}
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
      />
      <circle
        className={styles.dot}
        cx={HALF}
        cy={HALF}
        r={9}
        fill={`url(#${gradientId})`}
        stroke="#F4FFD6"
        strokeWidth={1.2}
      />
      {/* Krążek jak pierścień, ale pełny; kolory w CSS (limonka + znak `#101318`, w tonie `accent` odwrotnie). */}
      <g className={styles.help}>
        <circle className={styles.disc} cx={HALF} cy={HALF} r={19} stroke={`url(#${gradientId})`} strokeWidth={2.5} />
        <text className={cx(styles.glyph, styles.glyphQ)} x={HALF} y={HALF} textAnchor="middle" dominantBaseline="central">
          ?
        </text>
        <text className={cx(styles.glyph, styles.glyphClose)} x={HALF} y={HALF} textAnchor="middle" dominantBaseline="central">
          −
        </text>
      </g>
      <g className={styles.calendar}>
        <circle className={styles.disc} cx={HALF} cy={HALF} r={19} stroke={`url(#${gradientId})`} strokeWidth={2.5} />
        <g className={styles.icon} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x={36} y={37.5} width={16} height={14} rx={2} />
          <path d="M40 35v4.5M48 35v4.5" />
        </g>
        <circle className={styles.iconDot} cx={HALF} cy={45.5} r={1.8} />
      </g>
    </svg>
  );
}
