"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cx } from "@/lib/cx";
import styles from "./StickerBoard.module.css";

/** Krok przesunięcia strzałką (legacy: 16 px). */
const KEY_STEP = 16;

const KEY_DELTAS: Record<string, readonly [number, number]> = {
  ArrowLeft: [-KEY_STEP, 0],
  ArrowRight: [KEY_STEP, 0],
  ArrowUp: [0, -KEY_STEP],
  ArrowDown: [0, KEY_STEP],
};

export interface DragStickerProps {
  /** Zaufany SVG z `STICKERS`. */
  svg: string;
  /** Pozycja startowa w % planszy. */
  left: number;
  top: number;
  /** Bok naklejki w px. */
  size: number;
  /** Obrót w stopniach. */
  rotate: number;
  label: string;
  /** `id` instrukcji dla czytnika ekranu. */
  describedBy?: string;
  /** Indeks staggeru reveal (`.fade` + `--i`), przycięty przez wołającego (np. modulo). */
  index?: number;
}

/**
 * Jedna przeciągana naklejka: Pointer Events (mysz, dotyk, pióro) z pointer
 * capture i strzałki z klawiatury (16 px). Pozycja trzymana w DOM (`left`/`top`
 * w px po pierwszym ruchu), bez re-renderu na każdy ruch. Client Component.
 */
export function DragSticker({ svg, left, top, size, rotate, label, describedBy, index }: DragStickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  /* Ref dla logiki ruchu (bez czekania na re-render), stan tylko dla klasy. */
  const heldRef = useRef(false);
  const [held, setHeld] = useState(false);

  /** Ustawia pozycję w px, przyciętą do planszy (rodzica pozycjonującego). */
  const moveTo = (x: number, y: number) => {
    const el = ref.current;
    const board = el?.offsetParent;
    if (!el || !(board instanceof HTMLElement)) return;
    const maxX = board.clientWidth - el.offsetWidth;
    const maxY = board.clientHeight - el.offsetHeight;
    el.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
    el.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    const rect = el.getBoundingClientRect();
    offset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    heldRef.current = true;
    setHeld(true);
    event.preventDefault();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!heldRef.current) return;
    const board = event.currentTarget.offsetParent;
    if (!(board instanceof HTMLElement)) return;
    const rect = board.getBoundingClientRect();
    moveTo(event.clientX - rect.left - offset.current.x, event.clientY - rect.top - offset.current.y);
  };

  const drop = () => {
    heldRef.current = false;
    setHeld(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = KEY_DELTAS[event.key];
    if (!delta) return;
    event.preventDefault();
    const el = event.currentTarget;
    moveTo(el.offsetLeft + delta[0], el.offsetTop + delta[1]);
  };

  return (
    <div
      ref={ref}
      className={cx(styles.drag, held && styles.held, "fade")}
      style={{ left: `${left}%`, top: `${top}%`, "--s": `${size}px`, "--r": `${rotate}deg`, "--i": index }}
      tabIndex={0}
      role="img"
      data-cursor="grab"
      aria-label={label}
      aria-describedby={describedBy}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={drop}
      onPointerCancel={drop}
      onLostPointerCapture={drop}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
