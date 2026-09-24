/*
 * Celowo bez eksportu `HeroScene.tsx` (statyczny import wciągnąłby three.js do bundla strony).
 * Kanwę renderuj przez `LazyHeroScene`.
 */
export { LazyHeroScene } from "./LazyHeroScene";
export { createFussStore } from "./fussStore";
export type { FussStore, HeroSceneProps, SceneFit, SceneRepel } from "./types";
