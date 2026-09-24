"use client";

import { useMediaQuery } from "./useMediaQuery";

/** `true`, gdy użytkownik ma `prefers-reduced-motion: reduce`. Na serwerze `false`. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
