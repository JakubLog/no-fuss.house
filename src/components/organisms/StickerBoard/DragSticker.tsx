"use client";

import { useRef, useState, type PointerEvent } from "react";
import { cx } from "@/lib/cx";
import styles from "./StickerBoard.module.css";

export interface DragStickerProps {
  /** Zaufany SVG z `STICKERS`. */
  svg: string;
  /** Pozycja startowa [left %, top %] w planszy, układ poziomy (od 768 px). */
  landscapeSpot: readonly [number, number];
  /** Pozycja startowa [left %, top %] w planszy, układ pionowy (telefon, tablet w pionie). */
  portraitSpot: readonly [number, number];
  /** Bok naklejki w px w układzie poziomym (w pionowym CSS skaluje go z szerokością ekranu). */
  size: number;
  /** Obrót w stopniach. */
  rotate: number;
  /** Indeks staggeru reveal (`.fade` + `--i`), przycięty przez wołającego (np. modulo). */
  index?: number;
}

/**
 * Jedna przeciągana naklejka: Pointer Events (mysz, dotyk, pióro) z pointer capture. Dekoracja
 * poza kolejnością Tab i drzewem dostępności (`aria-hidden`, decyzja właściciela: Tab nie
 * skacze po planszy). Pozycję startową i rozmiar liczy CSS (osobno układ poziomy i pionowy,
 * przycięte do planszy); po pierwszym ruchu pozycja w DOM (`left`/`top` w px), bez re-renderu
 * na każdy ruch. Client Component.
 */
export function DragSticker({ svg, landscapeSpot, portraitSpot, size, rotate, index }: DragStickerProps) {
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

  return (
    <div
      ref={ref}
      className={cx(styles.drag, held && styles.held, "fade")}
      style={{
        "--x": landscapeSpot[0],
        "--y": landscapeSpot[1],
        "--x-p": portraitSpot[0],
        "--y-p": portraitSpot[1],
        "--s": size,
        "--r": `${rotate}deg`,
        "--i": index,
      }}
      aria-hidden="true"
      data-cursor="grab"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={drop}
      onPointerCancel={drop}
      onLostPointerCapture={drop}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
