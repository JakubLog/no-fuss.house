"use client";

import { useMediaQuery } from "./useMediaQuery";

/** `true` na urządzeniach z precyzyjnym wskaźnikiem (mysz, trackpad). Na serwerze `false`. */
export function usePointerFine(): boolean {
  return useMediaQuery("(pointer: fine)");
}
