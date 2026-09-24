"use client";

import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { buildGridPaths } from "./gridPaths";
import styles from "./GridOverlay.module.css";

/**
 * Stała siatka z krzyżykami pasowania (fixed, z-index 1, `mix-blend-mode: difference`).
 * Leży nad tłami sekcji, pod treścią (treść sekcji ma z-index 2). Client Component.
 */
export function GridOverlay() {
  const size = useViewportSize();
  const paths = size ? buildGridPaths(size) : null;

  return (
    <div className={styles.grid} aria-hidden="true">
      <svg className={styles.svg} viewBox={size ? `0 0 ${size.width} ${size.height}` : undefined}>
        {paths ? (
          <>
            <path d={paths.lines} fill="none" style={{ stroke: "var(--grid-line)" }} />
            <path d={paths.crosses} fill="none" style={{ stroke: "var(--grid-cross)" }} />
          </>
        ) : null}
      </svg>
    </div>
  );
}
