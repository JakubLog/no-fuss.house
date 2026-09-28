"use client";

import { useEffect, useState, type RefObject } from "react";

export interface UseSweepOptions {
  /** Ile ms świeci każdy element przebiegu. */
  stepMs: number;
  /** Opóźnienie startu po wejściu w widok. */
  delayMs: number;
  /**
   * Zapętlony przebieg (`0…count − 1`, znowu od `0`), tylko gdy cel jest w widoku: po wyjściu gaśnie, po powrocie
   * rusza od początku (i wtedy znowu sprawdza reduced motion). Cykl ponad 5 s bez pauzy nie spełnia WCAG 2.2.2.
   */
  loop?: boolean;
}

/**
 * Przebieg po liście: gdy górna krawędź celu minie 60% wysokości okna (IO, `rootMargin` −40% od dołu), po `delayMs`
 * zwraca kolejno indeksy `0…count − 1` (każdy przez `stepMs`), potem `null`. Bez `loop` raz: trzymaj wtedy
 * `count × stepMs` poniżej 5 s, a pauza nie jest potrzebna (WCAG 2.2.2). Przy reduced motion przebiegu nie ma
 * (jak `CountUp`: preferencja sprawdzana w chwili startu).
 */
export function useSweep(
  target: RefObject<Element | null>,
  count: number,
  { stepMs, delayMs, loop = false }: UseSweepOptions,
): number | null {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = target.current;
    if (count === 0 || !element || typeof IntersectionObserver === "undefined") return;
    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      setActive(null);
    };
    const show = (index: number) => {
      const i = loop ? index % count : index;
      setActive(i < count ? i : null);
      if (i < count) timer = window.setTimeout(() => show(i + 1), stepMs);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1]?.isIntersecting) {
          if (loop) stop();
          return;
        }
        if (!loop) io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => show(0), delayMs);
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(element);
    return () => {
      io.disconnect();
      stop();
    };
  }, [target, count, stepMs, delayMs, loop]);

  return active;
}
