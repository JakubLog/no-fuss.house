"use client";

import { useSyncExternalStore } from "react";
import { isIntroDone, subscribeIntro } from "@/lib/intro";

/** `true`, gdy preloader skończył (kurtyna odjechała). Na serwerze `false`. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false);
}
