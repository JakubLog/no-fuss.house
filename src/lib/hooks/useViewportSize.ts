"use client";

import { useSyncExternalStore } from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/* Snapshot musi być prymitywem (stabilne porównanie), stąd string „W×H”. */
const getSnapshot = () => `${window.innerWidth}x${window.innerHeight}`;
const getServerSnapshot = () => "";

/** Rozmiar okna (`innerWidth` × `innerHeight`). Na serwerze i przy hydratacji `null`. */
export function useViewportSize(): ViewportSize | null {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!snapshot) return null;
  const [width, height] = snapshot.split("x").map(Number);
  return { width, height };
}
