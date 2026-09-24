"use client";

import type Lenis from "lenis";
import { useSyncExternalStore } from "react";
import { getLenis, subscribeLenis } from "./lenis-store";

/**
 * Instancja Lenis albo `null` (reduced motion / przed montażem).
 * Przykład: `useLenis()?.scrollTo("#kontakt")`. Zawsze obsłuż `null`.
 */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(subscribeLenis, getLenis, () => null);
}
