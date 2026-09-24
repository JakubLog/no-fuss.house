import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./PhotoPlaceholder.module.css";

export interface PhotoPlaceholderProps {
  /** Podpis w ramce przerywanej (1:1 z legacy, np. „Zdjęcie Magdy 3:4”). */
  label?: string;
  /** Własna zawartość zamiast podpisu (np. ilustracja SVG). */
  children?: ReactNode;
  /** `tile` (domyślnie, `--tile`), `sky` (`--shade-700`), `lime` (akcent). */
  tone?: "tile" | "sky" | "lime";
  /** Z `children`-ilustracją: nazwa dla czytnika (`role="img"`). */
  ariaLabel?: string;
  className?: string;
}

/**
 * Placeholder zdjęcia (legacy `.ph`): tło kafla w ukośne kreski i podpis mono.
 * Proporcje ustawia rodzic przez `className` (`aspect-ratio`). Server Component.
 */
export function PhotoPlaceholder({ label, children, tone = "tile", ariaLabel, className }: PhotoPlaceholderProps) {
  return (
    <div
      className={cx(styles.ph, tone !== "tile" && styles[tone], className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      {children ?? (label ? <span className={styles.label}>{label}</span> : null)}
    </div>
  );
}
