"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { CaseStudyVideo } from "@/content/types";
import styles from "./CaseStage.module.css";

export interface CaseStageVideoProps {
  video: CaseStudyVideo;
}

/**
 * Showreel pod hero: wideo bez dźwięku w pętli.
 * - gra tylko w widoku (IntersectionObserver), poza nim pauza,
 * - przy `prefers-reduced-motion` nie startuje sam, zostaje plakat,
 * - przycisk pauzy (WCAG 2.2.2: ruch dłuższy niż 5 s musi dać się zatrzymać).
 * Client Component.
 */
export function CaseStageVideo({ video }: CaseStageVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  /** Wybór użytkownika z przycisku; bez niego decyduje `prefers-reduced-motion`. */
  const [choice, setChoice] = useState<boolean | null>(null);
  const wantsPlay = choice ?? !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!wantsPlay) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [wantsPlay]);

  return (
    <>
      <video
        ref={ref}
        className={styles.img}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.alt}
      />
      <button type="button" className={styles.toggle} aria-pressed={!wantsPlay} onClick={() => setChoice(!wantsPlay)}>
        {wantsPlay ? "Pauza" : "Odtwórz"}
      </button>
    </>
  );
}
