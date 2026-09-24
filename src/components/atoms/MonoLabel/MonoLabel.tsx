import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MonoLabel.module.css";

export interface MonoLabelProps {
  children: ReactNode;
  /** `md` = 14/20 (--t-mono), `sm` = 12/16 (--t-mono-sm). */
  size?: "md" | "sm";
  /** Kolor `--muted` (numery sekcji, podpisy). */
  muted?: boolean;
  as?: "span" | "p" | "div" | "small" | "dt" | "dd" | "time";
  className?: string;
  id?: string;
}

/** Etykieta mono wersalikami (metadane, numery sekcji, HUD). Server Component. */
export function MonoLabel({ children, size = "md", muted = false, as: Tag = "span", className, id }: MonoLabelProps) {
  return (
    <Tag id={id} className={cx(size === "sm" ? "mono-sm" : "mono", muted && styles.muted, className)}>
      {children}
    </Tag>
  );
}
