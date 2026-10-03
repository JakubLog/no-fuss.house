"use client";

import { useEffect, useState } from "react";
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

/** Odliczanie 100% → 000% po sprzątaniu (legacy: 1100 ms). */
const COUNTDOWN_MS = 1100;

/** Ile pikseli przewinięcia wystarczy, żeby posprzątać napis. */
const SCROLL_CLEAN_PX = 24;

const format = (value: number) => `${String(value).padStart(3, "0")}%`;

/**
 * Część kliencka 404: scena, miernik zamieszania, tekst, powrót na stronę główną i zachęta do przewinięcia
 * w stronę mapy (`#mordor`). Pierwsze przewinięcie sprząta napis (zamiast dawnego „Posprzątaj”). Client Component.
 */
export function NotFoundStage() {
  const [fuss] = useState(() => createFussStore(1));
  const [unsupported, setUnsupported] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [percent, setPercent] = useState(100);

  /* Sprzątanie przy pierwszym przewinięciu w stronę mapy (Lenis też wysyła natywne `scroll`). */
  useEffect(() => {
    if (cleaned) return;
    const onScroll = () => {
      if (window.scrollY > SCROLL_CLEAN_PX) {
        fuss.set(0);
        setCleaned(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cleaned, fuss]);

  useEffect(() => {
    if (!cleaned) return;
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
        <div className={cx("fade", styles.cta)} style={{ "--i": 3 }}>
          <Button href="/">Wróć na stronę główną →</Button>
        </div>
      </div>
      <a href="#mordor" className={cx("fade", styles.scroll)} style={{ "--i": 4 }}>
        <span className={styles.scrollText}>
          <span className="mono-sm">{cleaned ? "Posprzątane. Teraz w drogę" : "Przewiń, posprzątamy po drodze"}</span>
          <span className={styles.scrollTitle}>Droga do Mordoru ↓</span>
        </span>
        <i className={styles.scrollTrack} aria-hidden="true" />
      </a>
    </>
  );
}
