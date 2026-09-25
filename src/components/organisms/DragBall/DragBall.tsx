"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { TileCaption } from "@/components/molecules/TileCaption";
import { cx } from "@/lib/cx";
import styles from "./DragBall.module.css";

/** Pozycja środka kuli w % pola (x: szerokości, y: wysokości). */
interface Point {
  x: number;
  y: number;
}

/** Start ≈ legacy (`left: 40%; top: 26%` przy kuli 22% szerokości w polu 16:9). */
const START: Point = { x: 51, y: 45.6 };
/** Krok strzałek w %, z Shift większy. */
const KEY_STEP = 4;
const KEY_STEP_BIG = 16;

const clamp = (v: number) => Math.max(0, Math.min(100, v));
const round = (v: number) => Math.round(v * 10) / 10;

export interface DragBallProps {
  /** Opis całego pola, np. „Rekonstrukcja hero otb.vc: przeciągnij kulę, gradient idzie za nią”. */
  label: string;
  /** Dwa słowa hasła (lewa góra, prawy dół), np. `["Open to", "beyond"]`. */
  words: readonly [string, string];
  /** Podpis mono pod polem (`TileCaption`, `--muted` sekcji): na palecie pola nie ma stałego kontrastu. */
  caption: string;
  /** `aria-label` kuli, np. „Kula”. */
  ballLabel: string;
  className?: string;
}

/**
 * Rekonstrukcja hero otb.vc (legacy `.otb`): kula w DOM/CSS (bez canvas), dwa
 * radialne gradienty idą za kulą, a gdy jej nie trzymamy, za kursorem myszy.
 *
 * - Pointer Events z capture (mysz, dotyk, rysik). `touch-action: none` tylko na kuli,
 *   więc przewijanie strony palcem po polu działa (w legacy blokowało całe pole).
 * - Klawiatura: fokus na kuli + strzałki (Shift = większy krok).
 * - Bez inercji i animacji (także przy reduced motion kula stoi tam, gdzie ją puścisz).
 *
 * Client Component.
 */
export function DragBall({ label, words, caption, ballLabel, className }: DragBallProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [ball, setBall] = useState<Point>(START);
  const [glow, setGlow] = useState<Point | null>(null);
  const [held, setHeld] = useState(false);

  const toPoint = (clientX: number, clientY: number): Point | null => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return {
      x: round(clamp(((clientX - rect.left) / rect.width) * 100)),
      y: round(clamp(((clientY - rect.top) / rect.height) * 100)),
    };
  };

  const moveBall = (p: Point) => {
    setBall(p);
    setGlow(p);
  };

  const onBallDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    setHeld(true);
  };

  const onBallMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!held) return;
    const p = toPoint(event.clientX, event.clientY);
    if (p) moveBall(p);
  };

  const drop = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setHeld(false);
  };

  /* Gradient za kursorem myszy, gdy kula nie jest trzymana (legacy `mousemove`). */
  const onFieldMove = (event: PointerEvent<HTMLDivElement>) => {
    if (held || event.pointerType !== "mouse") return;
    const p = toPoint(event.clientX, event.clientY);
    if (p) setGlow(p);
  };

  const onBallKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    moveBall({ x: round(clamp(ball.x + d.x)), y: round(clamp(ball.y + d.y)) });
  };

  const style: CSSProperties = {
    /* kula ma 22% szerokości pola: połowa to 11% (x) i 11cqw (y) */
    "--bx": `calc(${ball.x}% - 11%)`,
    "--by": `calc(${ball.y}% - 11cqw)`,
    ...(glow ? { "--gx": `${glow.x}%`, "--gy": `${glow.y}%` } : {}),
  };

  return (
    <figure className={className}>
      <div ref={fieldRef} className={styles.field} style={style} role="group" aria-label={label} onPointerMove={onFieldMove}>
        <p className={cx(styles.word, styles.a)} aria-hidden="true">
          {words[0]}
        </p>
        <p className={cx(styles.word, styles.b)} aria-hidden="true">
          {words[1]}
        </p>
        <div
          className={cx(styles.ball, held && styles.held)}
          role="slider"
          tabIndex={0}
          data-cursor="grab"
          aria-label={ballLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ball.x)}
          aria-valuetext={`poziomo ${Math.round(ball.x)}%, pionowo ${Math.round(ball.y)}%`}
          onPointerDown={onBallDown}
          onPointerMove={onBallMove}
          onPointerUp={drop}
          onPointerCancel={drop}
          onKeyDown={onBallKey}
        />
      </div>
      <TileCaption>{caption}</TileCaption>
    </figure>
  );
}
