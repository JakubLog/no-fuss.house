"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { createHeroScene, DEFAULT_FIT, DEFAULT_REPEL, type SceneHandle } from "./createScene";
import type { HeroSceneProps } from "./types";
import styles from "./HeroScene.module.css";

/**
 * Kanwa WebGL z napisem 3D (legacy `.hero__canvas`). Ładuj przez `LazyHeroScene`
 * (next/dynamic, `ssr: false`), nigdy bezpośrednio: import ciągnie three.js.
 *
 * Jak legacy: scena powstaje od razu (pod preloaderem), bez dodatkowego wejścia opacity,
 * więc po zjeździe kurtyny litery już stoją i fizyka działa. Kanwa jest dekoracją
 * (`aria-hidden`), tekstowy odpowiednik daje rodzic. Client Component.
 */
export default function HeroScene({
  text,
  fuss,
  fit = DEFAULT_FIT,
  repel = DEFAULT_REPEL,
  className,
  onUnsupported,
}: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const reportUnsupported = useEffectEvent(() => onUnsupported?.());

  /* Prymitywy zamiast obiektów w zależnościach: inline `fit={{…}}` nie przebuduje sceny co render. */
  const { widthDesktop, widthMobile, maxScale, offsetYDesktop, offsetYMobile } = fit;
  const repelRadius = repel ? repel.radius : null;
  const repelStrength = repel ? repel.strength : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let handle: SceneHandle | null = null;

    try {
      handle = createHeroScene(canvas, {
        text,
        fuss,
        fit: { widthDesktop, widthMobile, maxScale, offsetYDesktop, offsetYMobile },
        repel: repelRadius !== null && repelStrength !== null ? { radius: repelRadius, strength: repelStrength } : false,
        onReady: () => setReady(true),
        onError: () => reportUnsupported(),
      });
    } catch {
      reportUnsupported();
    }

    return () => {
      handle?.dispose();
      handle = null;
    };
  }, [text, fuss, widthDesktop, widthMobile, maxScale, offsetYDesktop, offsetYMobile, repelRadius, repelStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={cx(styles.canvas, className)}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
