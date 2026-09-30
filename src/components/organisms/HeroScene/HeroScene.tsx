"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { DEFAULT_FIT, DEFAULT_REPEL } from "./defaults";
import { mountHeroScene } from "./mountScene";
import type { HeroSceneProps } from "./types";
import styles from "./HeroScene.module.css";

/**
 * Kanwa WebGL z napisem 3D (legacy `.hero__canvas`). Ładuj przez `LazyHeroScene`
 * (next/dynamic, `ssr: false`), nie bezpośrednio.
 *
 * Scena rysuje w workerze (`mountScene.ts`), bez dodatkowego wejścia opacity. Litery startują
 * w pozie startowego zamieszania (`fuss.get()`), fizyka działa od pierwszej klatki. Kanwa jest
 * dekoracją (`aria-hidden`), tekstowy odpowiednik daje rodzic. Client Component.
 */
export default function HeroScene({
  text,
  fuss,
  fit = DEFAULT_FIT,
  repel = DEFAULT_REPEL,
  className,
  frame,
  onUnsupported,
  onReady,
}: HeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reportUnsupported = useEffectEvent(() => onUnsupported?.());
  const reportReady = useEffectEvent(() => onReady?.());

  /* Prymitywy zamiast obiektów w zależnościach: inline `fit={{…}}` nie przebuduje sceny co render. */
  const { widthDesktop, widthMobile, heightDesktop, maxScale, offsetYDesktop, offsetYMobile } = fit;
  const repelRadius = repel ? repel.radius : null;
  const repelStrength = repel ? repel.strength : null;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    /* Nowa kanwa przy każdym montażu: `transferControlToOffscreen` działa raz na element (Strict Mode, zmiana `fit`). */
    const canvas = document.createElement("canvas");
    host.append(canvas);
    const unmount = mountHeroScene(canvas, {
      text,
      fuss,
      fit: { widthDesktop, widthMobile, heightDesktop, maxScale, offsetYDesktop, offsetYMobile },
      frame: frame?.current ?? null,
      repel: repelRadius !== null && repelStrength !== null ? { radius: repelRadius, strength: repelStrength } : false,
      onReady: () => {
        setReady(true);
        reportReady();
      },
      onError: () => reportUnsupported(),
    });
    return () => {
      unmount();
      canvas.remove();
    };
  }, [
    text,
    fuss,
    widthDesktop,
    widthMobile,
    heightDesktop,
    maxScale,
    offsetYDesktop,
    offsetYMobile,
    repelRadius,
    frame,
    repelStrength,
  ]);

  return (
    <div
      ref={hostRef}
      className={cx(styles.canvas, className)}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
