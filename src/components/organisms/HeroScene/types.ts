/**
 * Kanał suwak → scena bez re-renderów React: scena czyta `get()` w każdej klatce,
 * suwak / przycisk woła `set()`. Wartość 0–1 (0 = litery ułożone, 1 = rozrzucone).
 */
export interface FussStore {
  get(): number;
  set(value: number): void;
}

/**
 * Dopasowanie napisu do kanwy (legacy `fit()`). Szerokość napisu = ułamek widocznej
 * szerokości sceny, przesunięcie w pionie = ułamek widocznej wysokości. Próg mobile: 768 px.
 */
export interface SceneFit {
  /** Ułamek szerokości kanwy na desktopie (hero: 0.62, 404: 0.5). */
  widthDesktop: number;
  /** Ułamek szerokości kanwy poniżej 768 px (hero: 0.86, 404: 0.7). */
  widthMobile: number;
  /** Górny limit skali grupy (hero: 1.4, 404: 1.0). */
  maxScale: number;
  /** Przesunięcie w górę, ułamek wysokości sceny, desktop (hero: 0.02, 404: 0.1). */
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
  /** Źródło zamieszania. Wartość początkowa sklepu = zamieszanie na starcie (404: 1). */
  fuss: FussStore;
  /** Dopasowanie; domyślnie jak hero strony głównej. Zmiana pól przebudowuje scenę. */
  fit?: SceneFit;
  /** Odpychanie od wskaźnika; `false` wyłącza. Domyślnie jak w legacy. */
  repel?: SceneRepel | false;
  className?: string;
  /** Brak WebGL albo fontu: rodzic pokazuje fallback CSS (legacy `.no-webgl`). */
  onUnsupported?: () => void;
}
