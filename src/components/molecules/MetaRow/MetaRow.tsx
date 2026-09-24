import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MetaRow.module.css";

export interface MetaRowProps {
  /** Lewa strona: nazwa, np. „OTB Ventures”. */
  name: ReactNode;
  /** Prawa strona: rok albo zakres, np. „2025–2026”. */
  meta: ReactNode;
  /** Strzałka „→” po roku; przesuwa się, gdy najbliższy link-przodek ma hover. */
  arrow?: boolean;
  className?: string;
}

/** Wiersz mono pod kaflem: nazwa po lewej, rok po prawej (legacy `.tile__meta`). Server Component. */
export function MetaRow({ name, meta, arrow = false, className }: MetaRowProps) {
  return (
    <div className={cx("mono", styles.row, className)}>
      <span>{name}</span>
      <span>
        {meta}
        {arrow ? (
          <>
            {" "}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
}
