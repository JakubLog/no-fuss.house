"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { Tag } from "@/components/atoms/Tag";
import { createFussStore, LazyHeroScene, type SceneFit } from "@/components/organisms/HeroScene";
import { cx } from "@/lib/cx";
import styles from "./NotFoundHero.module.css";

/** Dopasowanie 1:1 z legacy/404.html: mniejszy napis, wyżej nad tekstem. */
const FIT_404: SceneFit = {
  widthDesktop: 0.5,
  widthMobile: 0.7,
  maxScale: 1,
  offsetYDesktop: 0.1,
  offsetYMobile: 0.16,
};

/** Odliczanie 100% → 000% po „Posprzątaj” (legacy: 1100 ms). */
const COUNTDOWN_MS = 1100;

const format = (value: number) => `${String(value).padStart(3, "0")}%`;

/** Część kliencka 404: scena, miernik zamieszania, tekst i przyciski. Client Component. */
export function NotFoundStage() {
  const [fuss] = useState(() => createFussStore(1));
  const [unsupported, setUnsupported] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [percent, setPercent] = useState(100);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cleaned) return;
    /* Przycisk znika, więc fokus idzie na link powrotny (pierwszy w rzędzie, nie gubi się na <body>). */
    const hadFocus = document.activeElement === document.body || ctaRef.current?.contains(document.activeElement);
    if (hadFocus) ctaRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNTDOWN_MS);
      setPercent(Math.round(100 * (1 - p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cleaned]);

  const clean = () => {
    if (cleaned) return;
    fuss.set(0);
    setCleaned(true);
  };

  return (
    <>
      {unsupported ? (
        <div className={styles.fallback} aria-hidden="true">
          404
        </div>
      ) : (
        <LazyHeroScene text="404" fuss={fuss} fit={FIT_404} onUnsupported={() => setUnsupported(true)} />
      )}
      <StickerLayer />
      <h1 className="sr-only">404, tej strony nie ma</h1>
      <div className={styles.bottom}>
        <p className="mono fade">
          <Tag>Błąd 404</Tag> {" "}Tej strony nie ma
        </p>
        <div className={cx("mono-sm fade", styles.meter)} style={{ "--i": 1, "--p": cleaned ? 0 : 1 }}>
          <span>Zamieszanie</span>
          <i aria-hidden="true" />
          <output>{format(percent)}</output>
        </div>
        <p className={cx("fade", styles.txt)} style={{ "--i": 2 }} aria-live="polite">
          {cleaned
            ? "Zero zamieszania. Teraz wracaj tam, gdzie coś jest."
            : "Ktoś tu narobił zamieszania. Adres nie istnieje, ale my tak."}
        </p>
        <div ref={ctaRef} className={cx("fade", styles.cta)} style={{ "--i": 3 }}>
          <Button href="/">Wróć na stronę główną →</Button>
          {cleaned ? null : (
            <Button variant="ghost" onClick={clean}>
              Posprzątaj ↓
            </Button>
          )}
          <Button variant="ghost" href="/#realizacje">
            Realizacje
          </Button>
        </div>
      </div>
    </>
  );
}
