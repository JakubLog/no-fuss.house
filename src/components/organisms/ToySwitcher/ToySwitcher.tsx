"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { TileCaption } from "@/components/molecules/TileCaption";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./ToySwitcher.module.css";

export interface Toy {
  /** Nazwa zakładki, np. „Pulpit”. */
  name: string;
  /** Mały dopisek mono po prawej, np. „kamera”. */
  tag: string;
  /** Podpis pod obrazem. */
  caption: string;
  image: Required<CaseStudyImage>;
}

export interface ToySwitcherProps {
  toys: readonly Toy[];
  /** `aria-label` listy zakładek (legacy: tytuł sekcji). */
  ariaLabel: string;
  className?: string;
}

/**
 * Przełącznik zabawek Sassy (legacy `.sw2`): od 1024 px lista po lewej (sticky),
 * kadr 16:10 po prawej z przenikaniem i podpisem; węziej kadr nad listą (tylko wizualnie).
 *
 * Wzorzec ARIA tabs: `tablist` + `tab` (roving tabindex) + jeden `tabpanel`.
 * Klawiatura: ↑ ↓ (jak w legacy) oraz ← → Home End; aktywacja od razu przy zmianie fokusu.
 * Client Component.
 */
export function ToySwitcher({ toys, ariaLabel, className }: ToySwitcherProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  const go = (index: number) => {
    const next = (index + toys.length) % toys.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: toys.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    go(target);
  };

  return (
    <div className={cx(styles.switcher, className)}>
      <div
        className={styles.list}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {toys.map((toy, i) => (
          <button
            key={toy.name}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={tabId(i)}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={i === active}
            aria-controls={panelId}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {toy.name}
            <small className="mono-sm">{toy.tag}</small>
          </button>
        ))}
      </div>
      <figure className={styles.view} id={panelId} role="tabpanel" aria-labelledby={tabId(active)}>
        <div className={styles.frame}>
          {toys.map((toy, i) => (
            <Image
              key={toy.image.src}
              className={cx(styles.img, i === active && styles.on)}
              src={toy.image.src}
              alt={i === active ? toy.image.alt : ""}
              aria-hidden={i === active ? undefined : true}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          ))}
        </div>
        <TileCaption>{toys[active]?.caption}</TileCaption>
      </figure>
    </div>
  );
}
