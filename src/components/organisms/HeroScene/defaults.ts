import type { SceneFit, SceneRepel } from "./types";

/*
 * Domyślne `fit` i `repel` osobno od `createScene.ts`: `HeroScene.tsx` żyje na głównym wątku,
 * a import z silnika wciągnąłby tam three.js (silnik ładuje worker albo, awaryjnie, dynamiczny import).
 */

/**
 * Dopasowanie hero `/`. Od 768 px napis wpisuje się w ramkę (`frame`: pas między h1 w lewym
 * górnym rogu a leadem z CTA w prawym dolnym): środek ramki, wysokość z przechyłem = wysokość
 * ramki (przechył podnosi prawy koniec, a h1 stoi z lewej, lead z prawej, więc rogi napisu mijają
 * tekst), szerokość do 62% kanwy. Telefon: bez ramki, napis nad tekstem (`offsetYMobile`).
 */
export const DEFAULT_FIT: SceneFit = {
  widthDesktop: 0.62,
  widthMobile: 0.86,
  heightDesktop: 1,
  maxScale: 1.4,
  offsetYDesktop: 0,
  offsetYMobile: 0.12,
};

export const DEFAULT_REPEL: SceneRepel = { radius: 1.2, strength: 60 };
