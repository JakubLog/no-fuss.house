import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./TileCaption.module.css";

export interface TileCaptionProps {
  children: ReactNode;
  /** `figcaption` wewnątrz `<figure>`, inaczej `p`. */
  as?: "figcaption" | "p";
  /** `muted` (domyślnie, legacy `.cs-cap`) albo `ink`: kolor tekstu sekcji (legacy `.screens figcaption`). */
  tone?: "muted" | "ink";
  className?: string;
}

/** Podpis pod obrazem / wizualizacją: mono 12 px, `--muted` (legacy `.cs-cap`). Server Component. */
export function TileCaption({ children, as: Tag = "figcaption", tone = "muted", className }: TileCaptionProps) {
  return <Tag className={cx("mono-sm", styles.caption, tone === "ink" && styles.ink, className)}>{children}</Tag>;
}
