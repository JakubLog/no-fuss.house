"use client";

import { useState, type ReactNode } from "react";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { FussSlider } from "@/components/molecules/FussSlider";
import { createFussStore, LazyHeroScene } from "@/components/organisms/HeroScene";
import { cx } from "@/lib/cx";
import styles from "./HomeHero.module.css";

export interface HomeHeroStageProps {
  /** Blok roli i akapitów (serwerowy). */
  top: ReactNode;
  /** Nagłówek h1 z leadem i CTA (serwerowy). */
  headline: ReactNode;
  /** Tekstowy odpowiednik kanwy (serwerowy, ukryty wizualnie). */
  sceneLabel?: ReactNode;
  /** Klasa kanwy i fallbacku (np. ograniczenie do pierwszego ekranu na telefonie). */
  sceneClassName?: string;
}

const TEXT = "no–fuss";
const HINT = "Suwak miesza litery napisu no–fuss w tle. Zero oznacza porządek.";

/**
 * Część kliencka hero: scena 3D + fallback CSS + suwak, spięte sklepem zamieszania
 * (bez re-renderów w pętli). Kolejność DOM: kanwa, naklejki (pod siatką), potem treść
 * nad siatką: h1 z leadem i CTA, rola z akapitami, suwak na końcu (fokus i czytnik
 * dostają treść przed zabawką). Warstwy ustawia `z-index`, nie kolejność. Client Component.
 */
export function HomeHeroStage({ top, headline, sceneLabel, sceneClassName }: HomeHeroStageProps) {
  const [fuss] = useState(() => createFussStore(0));
  const [unsupported, setUnsupported] = useState(false);

  return (
    <>
      {unsupported ? (
        <div className={cx(styles.fallback, sceneClassName)} aria-hidden="true">
          {TEXT}
        </div>
      ) : (
        <LazyHeroScene
          text={TEXT}
          fuss={fuss}
          className={sceneClassName}
          onUnsupported={() => setUnsupported(true)}
        />
      )}
      {sceneLabel}
      <StickerLayer />
      {headline}
      {top}
      {unsupported ? null : (
        <FussSlider
          className={cx(styles.fuss, "fade")}
          style={{ "--i": 8 }}
          onValueChange={fuss.set}
          hint={HINT}
        />
      )}
    </>
  );
}
