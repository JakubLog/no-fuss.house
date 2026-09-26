"use client";

import { useEffect, useState, type RefObject } from "react";

export interface UseSweepOptions {
  /** Ile ms świeci każdy element przebiegu. */
  stepMs: number;
  /** Opóźnienie startu po wejściu w widok. */
  delayMs: number;
}

/**
 * Jednorazowy przebieg po liście: gdy górna krawędź celu minie 60% wysokości okna (IO, `rootMargin` −40% od dołu, raz),
 * po `delayMs` zwraca kolejno indeksy `0…count − 1` (każdy przez `stepMs`), potem `null`. Trzymaj `count × stepMs`
 * poniżej 5 s: wtedy bez przycisku pauzy (WCAG 2.2.2). Przy reduced motion przebiegu nie ma (jak `CountUp`:
 * preferencja sprawdzana w chwili startu).
 */
export function useSweep(
  target: RefObject<Element | null>,
  count: number,
  { stepMs, delayMs }: UseSweepOptions,
): number | null {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = target.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    let timer = 0;
    const show = (index: number) => {
      setActive(index < count ? index : null);
      if (index < count) timer = window.setTimeout(() => show(index + 1), stepMs);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timer = window.setTimeout(() => show(0), delayMs);
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(element);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [target, count, stepMs, delayMs]);

  return active;
}
