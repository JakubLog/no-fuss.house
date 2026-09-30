import type { RefObject } from "react";

/**
 * Kanał sklep → scena bez re-renderów React: `set()` woła przycisk „Posprzątaj” na 404 i ułożenie napisu
 * po intro na `/`, a host sceny przekazuje każdą zmianę (`subscribe`) do workera albo sceny na głównym wątku.
 * Wartość 0–1 (0 = litery ułożone, 1 = rozrzucone).
 */
export interface FussStore {
  get(): number;
  set(value: number): void;
  /** Słuchacz dostaje każdą zmianę wartości; zwraca funkcję wypisania. */
  subscribe(listener: (value: number) => void): () => void;
}

/**
 * Dopasowanie napisu do kanwy (legacy `fit()`). Szerokość napisu = ułamek widocznej
 * szerokości sceny, przesunięcie w pionie = ułamek widocznej wysokości. Z ramką (`frame`,
 * od 768 px) napis stoi na środku ramki i ma wysokość do `heightDesktop` × ramka. Próg mobile: 768 px.
 */
export interface SceneFit {
  /** Ułamek szerokości kanwy na desktopie (hero: 0.62, 404: 0.5). */
  widthDesktop: number;
  /** Ułamek szerokości kanwy poniżej 768 px (hero: 0.86, 404: 0.7). */
  widthMobile: number;
  /** Maks. wysokość napisu (z przechyłem) jako ułamek wysokości ramki `frame`, desktop (hero: 0.9; 404: bez ramki). */
  heightDesktop?: number;
  /** Górny limit skali grupy (hero: 1.4, 404: 1.0). */
  maxScale: number;
  /** Przesunięcie w górę, ułamek wysokości sceny, desktop bez ramki (hero: 0; 404: 0.1). */
  offsetYDesktop: number;
  /** Przesunięcie w górę poniżej 768 px (hero: 0.12, 404: 0.16). */
  offsetYMobile: number;
}

/** Odpychanie liter od kursora (legacy: promień litery + 1.2, siła 60; `mousemove` na oknie, start = środek ekranu). */
export interface SceneRepel {
  /** Dodatek do promienia litery, w jednostkach sceny. */
  radius: number;
  /** Siła odpychania. */
  strength: number;
}

export interface HeroSceneProps {
  /** Tekst napisu 3D, np. „no–fuss” (z półpauzą U+2013) albo „404”. Stały przez życie komponentu. */
  text: string;
  /** Źródło zamieszania. Wartość początkowa sklepu = zamieszanie na starcie; litery startują w tej pozie (404 i `/`: 1). */
  fuss: FussStore;
  /** Dopasowanie; domyślnie jak hero strony głównej. Zmiana pól przebudowuje scenę. */
  fit?: SceneFit;
  /** Odpychanie od wskaźnika; `false` wyłącza. Domyślnie jak w legacy. */
  repel?: SceneRepel | false;
  className?: string;
  /**
   * Ramka napisu od 768 px: element, w którego środek i wysokość (× `fit.heightDesktop`) wpisuje
   * się napis; kanwa zostaje na całe hero. Ramka o wysokości 0 = zwykłe `offsetYDesktop`.
   */
  frame?: RefObject<HTMLElement | null>;
  /** Pierwsza klatka z literami narysowana (font wczytany, fizyka ruszyła). */
  onReady?: () => void;
  /** Brak WebGL albo nieudany start sceny (font, mapa otoczenia, geometria): rodzic pokazuje fallback CSS (legacy `.no-webgl`). */
  onUnsupported?: () => void;
}
