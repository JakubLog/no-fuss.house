/**
 * Stan orkiestracji wejścia: preloader → kurtyna → reveal hero.
 *
 * Preloader wywołuje `markIntroDone()` raz, przy pierwszym wejściu na stronę.
 * Kolejne nawigacje po stronie (client-side) widzą `isIntroDone() === true`.
 * Kod spoza Reacta (np. scena three.js) może słuchać zdarzenia `INTRO_EVENT` na `window`.
 */

export const INTRO_EVENT = "nf:intro-done";

type Listener = () => void;

let done = false;
const listeners = new Set<Listener>();

export function isIntroDone(): boolean {
  return done;
}

export function markIntroDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(INTRO_EVENT));
  }
}

export function subscribeIntro(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
