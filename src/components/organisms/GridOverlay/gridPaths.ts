import type { ViewportSize } from "@/lib/hooks/useViewportSize";

/* Czysta logika (bez "use client"): można ją importować także z Server Components. */

/** Parametry 1:1 z legacy `drawGrid()`. */
const DESKTOP_MIN = 1024;
const GUTTER_DESKTOP = 56;
const GUTTER_MOBILE = 16;
/** Przerwa w liniach wokół przecięcia. */
const GAP = 12;
/** Pół ramienia krzyżyka (krzyżyk 12 px). */
const CROSS = 6;

interface GridPaths {
  lines: string;
  crosses: string;
}

/** 3 piony (lewy gutter, środek, prawy gutter) × 2 poziomy (⅓ i 0.68 wysokości). */
export function buildGridPaths({ width: w, height: h }: ViewportSize): GridPaths {
  const g = w >= DESKTOP_MIN ? GUTTER_DESKTOP : GUTTER_MOBILE;
  const xs = [g + 0.5, Math.round(w / 2) + 0.5, w - g - 0.5];
  const ys = [Math.round(h / 3) + 0.5, Math.round(h * 0.68) + 0.5];
  let v = "";
  let hz = "";
  let x = "";

  xs.forEach((px) => {
    let y0 = 0;
    [...ys, h + GAP].forEach((py) => {
      v += `M${px} ${y0}V${py - GAP}`;
      y0 = py + GAP;
    });
  });
  ys.forEach((py) => {
    let x0 = 0;
    [...xs, w + GAP].forEach((px) => {
      hz += `M${x0} ${py}H${px - GAP}`;
      x0 = px + GAP;
    });
  });
  xs.forEach((px) =>
    ys.forEach((py) => {
      x += `M${px} ${py - CROSS}V${py + CROSS}M${px - CROSS} ${py}H${px + CROSS}`;
    }),
  );

  return { lines: v + hz, crosses: x };
}
