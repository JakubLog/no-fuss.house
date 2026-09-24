import type { ReactNode } from "react";
import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { cx } from "@/lib/cx";
import styles from "./CaseProse.module.css";

export interface CaseProseProps {
  /** Linie nagłówka `<h2>` z reveal. */
  lines: readonly ReactNode[];
  /**
   * `h2` (domyślnie): legacy `.cs-h`, wersaliki.
   * `quote`: legacy `.cs-quote` (display, bez wersalików) z `Mark`; nadal `<h2>` sekcji.
   */
  variant?: "h2" | "quote";
  /** Akapity w roli lead (legacy `.cs-p`, max 44ch). */
  paragraphs?: readonly ReactNode[];
  /** Indeks staggeru pierwszego akapitu (legacy: 2 w układzie split, 3 w szerokim). */
  paragraphIndex?: number;
  /** Większy odstęp pod ostatnim akapitem (32 px), gdy pod spodem jest wizualizacja. */
  spaced?: boolean;
  /** Treść pod akapitami (np. grafika, kafle). */
  children?: ReactNode;
}

/**
 * Nagłówek sekcji case study + akapity lead (legacy `.cs-txt` / `.cs-wide`).
 * Do `CaseStudySection` (`text` w split albo `children` w wide). Server Component.
 */
export function CaseProse({
  lines,
  variant = "h2",
  paragraphs = [],
  paragraphIndex = 2,
  spaced = false,
  children,
}: CaseProseProps) {
  const isQuote = variant === "quote";
  return (
    <>
      <Heading
        as="h2"
        variant={isQuote ? "display" : "h2"}
        uppercase={!isQuote}
        lines={lines}
        className={isQuote ? styles.quote : styles.h}
      />
      {paragraphs.map((p, i) => (
        <Fade
          key={i}
          as="p"
          index={paragraphIndex + i}
          className={cx(
            styles.p,
            i === 0 && (isQuote ? styles.afterQuote : styles.afterHeading),
            spaced && i === paragraphs.length - 1 && styles.spaced,
          )}
        >
          {p}
        </Fade>
      ))}
      {children}
    </>
  );
}

export interface CaseBigLineProps {
  children: ReactNode;
  /** `fade` (legacy 03.3) albo `line` (reveal od dołu, legacy 06). */
  reveal?: "fade" | "line";
  index?: number;
  className?: string;
}

/** Jedno duże zdanie w roli display (legacy `.bigline`). Server Component. */
export function CaseBigLine({ children, reveal = "fade", index, className }: CaseBigLineProps) {
  if (reveal === "line") {
    return (
      <p className={cx(styles.bigline, className)}>
        <span className="line" style={index ? { "--i": index } : undefined}>
          <span>{children}</span>
        </span>
      </p>
    );
  }
  return (
    <Fade as="p" index={index} className={cx(styles.bigline, className)}>
      {children}
    </Fade>
  );
}
