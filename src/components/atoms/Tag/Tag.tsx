import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Tag.module.css";

export interface TagProps {
  children: ReactNode;
  /** `accent`: czarny tekst na limonce (domyślnie). `line`: obrys 1 px w kolorze tekstu. */
  variant?: "accent" | "line";
  className?: string;
}

/** Tag / chip: mono 12 px wersalikami, limonkowe tło, ostre rogi. Server Component. */
export function Tag({ children, variant = "accent", className }: TagProps) {
  return <span className={cx("mono-sm", styles.tag, variant === "line" && styles.line, className)}>{children}</span>;
}
