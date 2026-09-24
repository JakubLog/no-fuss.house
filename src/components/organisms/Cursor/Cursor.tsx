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
/** Elementy, nad którymi nie klejimy naklejek (np. suwak „Zamieszanie”). */
const NO_STICKERS_SELECTOR = "[data-no-stickers]";
/**
 * Elementy z własnym kursorem (np. `PhoneScroller` z `ns-resize`, żywa ramka `LiveFrame`):
 * nad nimi chowamy strzałkę, zostaje kursor systemowy (bez podwójnego kursora).
 */
const NATIVE_CURSOR_SELECTOR = "[data-native-cursor]";
/** Opt-out: element fokusowalny, ale nieklikalny (kafle `ProcessSteps`), zostaje strzałka. Pierwszeństwo przed `grab` i `link`. */
const ARROW_SELECTOR = '[data-cursor="arrow"]';
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

/**
 * Limonkowa strzałka podążająca za kursorem (lerp 0.18) + naklejki w strefach
 * `data-stickers`. Tylko `(pointer: fine)`, wyłączona przy reduced motion.
 * Stany (`data-state` na SVG, bez re-renderów Reacta): `arrow`; `link` nad elementem
 * interaktywnym (strzałka → limonkowy pierścień); `grab` nad `[data-cursor="grab"]`
 * (mała pełna kropka, przy wciśnięciu `data-pressed` ściska się); `help` nad
 * `[data-cursor="help"]` (krążek z „?”, `data-open` → „−”); `calendar` nad
 * `[data-cursor="calendar"]` (krążek z ikoną kalendarza).
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

    /* Kolejność: arrow (opt-out) → grab → help → calendar → link. */
    const setState = (target: Element | null) => {
      let state: CursorState = "arrow";
      if (!target || target.closest(ARROW_SELECTOR)) state = "arrow";
      else if (target.closest(GRAB_SELECTOR)) state = "grab";
      else if (target.closest(HELP_SELECTOR)) state = "help";
      else if (target.closest(CALENDAR_SELECTOR)) state = "calendar";
      else if (target.closest(LINK_SELECTOR)) state = "link";
      if (cursor.dataset.state !== state) cursor.dataset.state = state;
      /* Otwarte pytanie FAQ: „−” zamiast „?” (odświeża się przy następnym ruchu). */
      const open = state === "help" && target?.closest("details")?.open === true ? "true" : "false";
      if (cursor.dataset.open !== open) cursor.dataset.open = open;
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

      const zone = target?.closest(`[${STICKER_ZONE_ATTR}]`);
      if (zone && !target?.closest(NO_STICKERS_SELECTOR) && Math.hypot(tx - last.x, ty - last.y) > STICKER_STEP) {
        last = { x: tx, y: ty };
        spawnSticker(zone);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") cursor.dataset.pressed = "true";
    };
    const onUp = () => {
      cursor.dataset.pressed = "false";
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
      data-pressed="false"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EAFFB0" />
          <stop offset=".55" stopColor="#BBFF00" />
          <stop offset="1" stopColor="#7DAA00" />
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
        fill="rgba(187, 255, 0, 0.28)"
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
      {/* Krążek jak pierścień, ale pełny; znak/ikona w `#101318`. */}
      <g className={styles.help}>
        <circle cx={HALF} cy={HALF} r={19} fill="#BBFF00" stroke={`url(#${gradientId})`} strokeWidth={2.5} />
        <text className={cx(styles.glyph, styles.glyphQ)} x={HALF} y={HALF} textAnchor="middle" dominantBaseline="central">
          ?
        </text>
        <text className={cx(styles.glyph, styles.glyphClose)} x={HALF} y={HALF} textAnchor="middle" dominantBaseline="central">
          −
        </text>
      </g>
      <g className={styles.calendar}>
        <circle cx={HALF} cy={HALF} r={19} fill="#BBFF00" stroke={`url(#${gradientId})`} strokeWidth={2.5} />
        <g fill="none" stroke="#101318" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x={36} y={37.5} width={16} height={14} rx={2} />
          <path d="M40 35v4.5M48 35v4.5" />
        </g>
        <circle cx={HALF} cy={45.5} r={1.8} fill="#101318" />
      </g>
    </svg>
  );
}
