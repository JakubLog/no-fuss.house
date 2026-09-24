"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Reveal } from "../Reveal";
import styles from "./LiveFrame.module.css";

/** Szerokość, w której renderujemy żywą stronę (układ desktopowy), potem skalujemy. */
const RENDER_WIDTH = 1440;

export interface LiveFrameProps {
  /** Adres żywej strony (1:1 z legacy). */
  src: string;
  /** Opisowy `title` ramki, np. „Busy Bee Film, żywa strona”. */
  title: string;
  /** Tekst w pasku adresu, np. „www.busybeefilm.pl · przewijaj i klikaj”. */
  urlLabel: string;
  /** Zrzut strony pod ramką: placeholder przed załadowaniem i fallback. */
  poster: Required<CaseStudyImage>;
  /**
   * `auto` (domyślnie): ramka ładuje się sama (legacy Busy Bee / AH, `loading="lazy"`).
   * `click`: najpierw poster i przycisk (legacy `.live`, OTB / Sassy).
   * Przy `prefers-reduced-motion`, poniżej 768 px i przy `pointer: coarse` zawsze `click`.
   */
  load?: "auto" | "click";
  /** Etykieta przycisku ładowania (legacy „Otwórz na żywo ↗”). */
  loadLabel?: string;
  /** `aria-label` przycisku, np. „Załaduj żywą stronę otb.vc”. */
  loadAriaLabel?: string;
  className?: string;
}

/**
 * Żywa strona klienta w ramce przeglądarki na limonkowej scenie (legacy `.stage--site`
 * + `.frame` / `.browser.live`). `<iframe>` ma 1440×900 i jest skalowany do szerokości
 * kontenera (`ResizeObserver` → `--s`), więc układ strony jest desktopowy.
 *
 * - `sandbox="allow-scripts allow-same-origin"` (legacy nie miał sandboxu): bez popupów,
 *   formularzy i nawigacji `top`.
 * - Pasek adresu jest linkiem „Otwórz stronę” (nowa karta): fallback, gdy strona
 *   blokuje osadzanie albo ramka się nie ładuje.
 * - Reduced motion, poniżej 768 px i `pointer: coarse`: ramka nie ładuje się sama
 *   (poster + przycisk). Poniżej 768 px przycisk jest linkiem do strony w nowej karcie
 *   (desktopowy układ w skali ~0,25 jest nieczytelny).
 * - SSR renderuje poster z przyciskiem; tryb (`iframe` / link) ustala się po hydratacji.
 * - Żywa ramka ma `data-native-cursor`: nad nią systemowy kursor zamiast własnego.
 *
 * Client Component (własny `Reveal`, stawiany bezpośrednio pod hero).
 */
export function LiveFrame({
  src,
  title,
  urlLabel,
  poster,
  load = "auto",
  loadLabel = "Otwórz na żywo ↗",
  loadAriaLabel,
  className,
}: LiveFrameProps) {
  /* Serwer i hydratacja: `true` (bez iframe w HTML), potem prawdziwa wartość. */
  const noAutoLoad = useMediaQuery("(prefers-reduced-motion: reduce), (max-width: 767px), (pointer: coarse)", true);
  /* Wąski ekran: zamiast ładować ramkę otwieramy stronę w nowej karcie. Serwer: `false` (przycisk). */
  const narrow = useMediaQuery("(max-width: 767px)");
  const [clicked, setClicked] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const isLive = clicked || (load === "auto" && !noAutoLoad);
  const host = new URL(src).host.replace(/^www\./, "");

  /* Skala: szerokość okna ramki / 1440 (legacy `fit()` na resize/load). */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const fit = () => vp.style.setProperty("--s", String(vp.clientWidth / RENDER_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(vp);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal className={cx(styles.stage, className)}>
      <div className={cx("fade", styles.frame)}>
        <a
          className={styles.url}
          href={src}
          target="_blank"
          rel="noopener"
          aria-label={`Otwórz stronę ${host} w nowej karcie`}
        >
          <span className={styles.urlText}>{urlLabel}</span>
        </a>
        <div ref={viewportRef} className={styles.viewport} data-native-cursor={isLive ? "" : undefined}>
          <Image
            className={styles.poster}
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            sizes="(min-width: 1212px) 1088px, 100vw"
          />
          {isLive ? (
            <iframe
              className={styles.iframe}
              src={src}
              title={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : narrow ? (
            <a
              className={styles.load}
              href={src}
              target="_blank"
              rel="noopener"
              aria-label={`${loadLabel.replace(/\s*↗$/, "")}: ${host} w nowej karcie`}
            >
              <span className="mono">{loadLabel}</span>
            </a>
          ) : (
            <button type="button" className={styles.load} aria-label={loadAriaLabel} onClick={() => setClicked(true)}>
              <span className="mono">{loadLabel}</span>
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
