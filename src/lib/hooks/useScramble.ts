"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Znaki scramble 1:1 z DESIGN.md. */
export const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#%";
export const SCRAMBLE_DURATION_MS = 420;

export interface UseScrambleOptions {
  /** Blokuje nowe uruchomienia (np. gdy CopyEmail pokazuje „Skopiowano ✓”). */
  disabled?: boolean;
  duration?: number;
}

export interface UseScrambleResult {
  /** Tekst do wyrenderowania: w trakcie animacji zaszumiony, poza nią oryginał. */
  text: string;
  /** Uruchom animację (na `mouseenter` / `focus`). Bez efektu przy reduced motion. */
  scramble: () => void;
  /** Przerwij animację i wróć do oryginału. */
  cancel: () => void;
  isScrambling: boolean;
}

/**
 * Scramble znaków: litery od lewej wracają do oryginału w ciągu `duration` ms,
 * reszta losuje znaki z SCRAMBLE_CHARS (spacje zostają). Stan w React, bez
 * mutowania DOM, więc bezpieczny przy re-renderach.
 */
export function useScramble(
  source: string,
  { disabled = false, duration = SCRAMBLE_DURATION_MS }: UseScrambleOptions = {},
): UseScrambleResult {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setFrame(null);
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const scramble = useCallback(() => {
    if (reduced || disabled || rafRef.current !== null) return;
    const start = performance.now();
    const chars = Array.from(source);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      if (progress >= 1) {
        rafRef.current = null;
        setFrame(null);
        return;
      }
      const keep = Math.floor(progress * chars.length);
      const noise = chars
        .slice(keep)
        .map((c) => (c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
        .join("");
      setFrame(chars.slice(0, keep).join("") + noise);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [reduced, disabled, duration, source]);

  return { text: frame ?? source, scramble, cancel, isScrambling: frame !== null };
}
