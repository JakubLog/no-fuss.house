import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Text.module.css";

export interface TextProps {
  children: ReactNode;
  /** `body` = 16/24, `lead` = akapity case study. */
  variant?: "body" | "lead";
  muted?: boolean;
  as?: "p" | "span" | "div";
  className?: string;
  id?: string;
}

/** Akapit / tekst ciągły (sans, nigdy mono). Server Component. */
export function Text({ children, variant = "body", muted = false, as: Tag = "p", className, id }: TextProps) {
  return (
    <Tag id={id} className={cx(styles[variant], muted && styles.muted, className)}>
      {children}
    </Tag>
  );
}
