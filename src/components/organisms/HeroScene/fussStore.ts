import type { FussStore } from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/**
 * Minimalny sklep zamieszania (0–1). Tworzony raz w komponencie klienckim:
 * `const [fuss] = useState(() => createFussStore(0))`.
 */
export function createFussStore(initial = 0): FussStore {
  let value = clamp01(initial);
  const listeners = new Set<(value: number) => void>();
  return {
    get: () => value,
    set: (next) => {
      const clamped = clamp01(next);
      if (clamped === value) return;
      value = clamped;
      for (const listener of listeners) listener(value);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
