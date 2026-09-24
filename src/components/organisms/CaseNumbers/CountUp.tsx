"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  /** Wartość końcowa (renderowana od razu na serwerze i dla czytników ekranu). */
  end: number;
  /** Czas animacji w ms (legacy: 1200, easing ease-out quart). */
  duration?: number;
}

/**
 * Licznik od 0 do `end`, gdy liczba wejdzie w viewport (threshold 0.6, raz).
 * Przy reduced motion stoi na wartości końcowej. Czytniki dostają tylko `end`.
 */
export function CountUp({ end, duration = 1200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Jak w legacy: preferencja sprawdzana w chwili startu, więc licznik nigdy nie utknie w połowie.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          setValue(Math.round(end * (1 - Math.pow(1 - p, 4))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{end}</span>
    </>
  );
}
