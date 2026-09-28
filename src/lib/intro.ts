/**
 * Start wejścia: sygnał dla reveal hero (Reveal `trigger="intro"`) i układania liter 3D na `/`.
 *
 * W przeglądarce intro rusza raz, gdy fonty są gotowe (`document.fonts.ready`), najpóźniej
 * `FONTS_TIMEOUT_MS` po załadowaniu JS (wtedy hero wjeżdża krojem zastępczym, zamiast stać puste).
 * Przy reduced motion od razu: bez animacji podmiana kroju niczego nie psuje.
 * Kolejne nawigacje po stronie (client-side) widzą `isIntroDone() === true`.
 * Kod spoza Reacta (np. scena three.js) może słuchać zdarzenia `INTRO_EVENT` na `window`.
 */

export const INTRO_EVENT = "nf:intro-done";

/** Najdłużej tyle hero czeka na fonty. Kroje są self-hostowane i preloadowane, więc zwykle są wcześniej. */
const FONTS_TIMEOUT_MS = 300;

type Listener = () => void;

let done = false;
const listeners = new Set<Listener>();

export function isIntroDone(): boolean {
  return done;
}

function markIntroDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new CustomEvent(INTRO_EVENT));
}

export function subscribeIntro(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof document.fonts === "undefined") {
    markIntroDone();
  } else {
    window.setTimeout(markIntroDone, FONTS_TIMEOUT_MS);
    document.fonts.ready.then(markIntroDone, markIntroDone);
  }
}
