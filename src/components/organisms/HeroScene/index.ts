/*
 * Celowo bez eksportu `HeroScene.tsx`: to scena tylko po stronie klienta (tworzy kanwę i worker), doładowywana
 * po hydratacji. Kanwę renderuj przez `LazyHeroScene`. three.js ładuje worker, nie ten moduł.
 */
export { LazyHeroScene } from "./LazyHeroScene";
export { createFussStore } from "./fussStore";
export type { FussStore, HeroSceneProps, SceneFit, SceneRepel } from "./types";
