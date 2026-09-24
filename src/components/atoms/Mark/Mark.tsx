import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Mark.module.css";

export interface MarkProps {
  children: ReactNode;
  className?: string;
}

/** Wyróżnienie w nagłówku: limonkowe tło, tekst `--on-accent`. Server Component. */
export function Mark({ children, className }: MarkProps) {
  return <mark className={cx(styles.mark, className)}>{children}</mark>;
}
