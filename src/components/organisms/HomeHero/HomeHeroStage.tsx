"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFussStore, LazyHeroScene } from "@/components/organisms/HeroScene";
import { INTRO_REVEAL_DELAY_MS, useIntroDone } from "@/lib/hooks";
import styles from "./HomeHero.module.css";

export interface HomeHeroStageProps {
  /** Nagłówek h1 z leadem i CTA (serwerowy). */
  headline: ReactNode;
  /** Tekstowy odpowiednik kanwy (serwerowy, ukryty wizualnie). */
  sceneLabel?: ReactNode;
}

const TEXT = "no–fuss";
/** Czas układania napisu: zamieszanie 1 → 0 (scena dodatkowo wygładza i dociąga sprężynami). */
const ASSEMBLE_MS = 1600;

/** Ease-in-out (kubiczne): chwila chaosu, szybkie zejście liter, łagodne dosiadanie na miejsce. */
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/**
 * Część kliencka hero: kanwa 3D na całe hero, pusta ramka `.band` (od 768 px pas między h1
 * a leadem z CTA, w który scena wpisuje napis; na telefonie tylko miejsce na fallback CSS),
 * potem treść. Kanwa, ramka i treść mają z-index 2 (nad siatką overlay); treść leży nad kanwą
 * dzięki kolejności w DOM.
 *
 * Wejście: litery startują rozrzucone (zamieszanie 1) i razem z reveal hero (intro +
 * `INTRO_REVEAL_DELAY_MS`) układają się w napis. Przy nawigacji klienckiej to samo, gdy scena
 * jest gotowa. Reduced motion: napis od początku ułożony. Client Component.
 */
export function HomeHeroStage({ headline, sceneLabel }: HomeHeroStageProps) {
  const [unsupported, setUnsupported] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const introDone = useIntroDone();
  const band = useRef<HTMLDivElement>(null);
  /* Sklep żyje tylko w przeglądarce (scena bez SSR), więc `window` w inicjalizatorze nie zmienia markupu. */
  const [fuss] = useState(() =>
    createFussStore(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1),
  );

  useEffect(() => {
    if (!sceneReady || !introDone) return;
    const from = fuss.get();
    if (from === 0) return;
    const start = performance.now() + INTRO_REVEAL_DELAY_MS;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / ASSEMBLE_MS));
      fuss.set(from * (1 - easeInOut(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sceneReady, introDone, fuss]);

  return (
    <>
      {unsupported ? null : (
        <LazyHeroScene
          text={TEXT}
          fuss={fuss}
          frame={band}
          onReady={() => setSceneReady(true)}
          onUnsupported={() => setUnsupported(true)}
        />
      )}
      <div ref={band} className={styles.band} aria-hidden="true">
        {unsupported ? <div className={styles.fallback}>{TEXT}</div> : null}
      </div>
      {sceneLabel}
      {headline}
    </>
  );
}
