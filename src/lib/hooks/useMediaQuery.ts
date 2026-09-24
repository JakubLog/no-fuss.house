"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subskrypcja `matchMedia` bez hydration mismatch.
 * Na serwerze i podczas hydratacji zwraca `serverValue`, potem prawdziwą wartość.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
