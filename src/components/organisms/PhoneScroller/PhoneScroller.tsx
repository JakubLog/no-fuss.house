"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import styles from "./PhoneScroller.module.css";

/** Krok przewijania strzałkami (legacy 120 px). */
const STEP = 120;

export interface PhoneScrollerProps {
  /** Pełny zrzut strony mobilnej (`m-full.webp`). */
  image: Required<CaseStudyImage>;
  /** Nazwa obszaru przewijania dla czytników, np. „Cała strona OTB na telefonie, przewijana”. */
  label: string;
  className?: string;
}

/**
 * Przewijany telefon (legacy `.scrollphone`): makieta `PhoneFrame`, w środku ekran 640 px
 * z własnym scrollem. `data-lenis-prevent`, więc kółko przewija ekran, nie stronę.
 * Fokus (Tab) + ↑ ↓ przewijają o 120 px, PageUp/PageDown/Home/End natywnie.
 *
 * Dotyk (`pointer: coarse`): ekran ma max ~56svh i nie łapie scrolla, dopóki nie zostanie
 * dotknięty (komunikat „Dotknij, aby przewijać”). Tap na ekranie → aktywny (własny scroll),
 * dotknięcie poza telefonem albo wyjazd telefonu z widoku → z powrotem nieaktywny.
 * Na serwerze i przy `pointer: fine` zachowanie bez zmian.
 *
 * Zrzut jest `unoptimized`: to już WebP, a wysokość 11–16 tys. px jest na granicy
 * limitów AVIF/WebP optymalizatora. Client Component (klawiatura, stan dotyku).
 */
export function PhoneScroller({ image, label, className }: PhoneScrollerProps) {
  const coarse = useMediaQuery("(pointer: coarse)");
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const locked = coarse && !active;

  /* Aktywny ekran: dotknięcie poza telefonem albo wyjazd z widoku go wyłącza. */
  useEffect(() => {
    const root = rootRef.current;
    if (!coarse || !active || !root) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.contains(event.target)) setActive(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting) setActive(false);
    });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    observer.observe(root);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      observer.disconnect();
    };
  }, [coarse, active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    event.currentTarget.scrollBy({ top: event.key === "ArrowDown" ? STEP : -STEP });
  };

  return (
    <div ref={rootRef} className={cx(styles.scrollphone, className)}>
      <PhoneFrame>
        <div
          className={styles.screen}
          role="region"
          aria-label={label}
          tabIndex={0}
          data-lenis-prevent=""
          data-native-cursor=""
          data-locked={locked ? "" : undefined}
          onKeyDown={onKeyDown}
          onClick={coarse && !active ? () => setActive(true) : undefined}
        >
          <Image
            className={styles.img}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="320px"
            unoptimized
          />
        </div>
        {locked ? (
          <span className={cx("mono-sm", styles.hint)} aria-hidden="true">
            Dotknij, aby przewijać
          </span>
        ) : null}
      </PhoneFrame>
    </div>
  );
}
