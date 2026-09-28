"use client";

import { useSyncExternalStore } from "react";
import { isIntroDone, subscribeIntro } from "@/lib/intro";

/** `true` po starcie wejścia (fonty gotowe, patrz `@/lib/intro`). Na serwerze `false`. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false);
}
