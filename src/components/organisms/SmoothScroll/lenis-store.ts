import type Lenis from "lenis";

/**
 * Bieżąca instancja Lenis (albo `null`: reduced motion, SSR, przed montażem).
 * Store modułowy zamiast Contextu: `useLenis()` działa w każdym Client Component
 * bez providera, a kod spoza Reacta może użyć `getLenis()`.
 */
let current: Lenis | null = null;
const listeners = new Set<() => void>();

export function getLenis(): Lenis | null {
  return current;
}

export function setLenis(instance: Lenis | null): void {
  current = instance;
  listeners.forEach((listener) => listener());
}

export function subscribeLenis(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
