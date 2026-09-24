"use client";

import dynamic from "next/dynamic";

/**
 * `HeroScene` doładowywana po hydratacji (osobny chunk z three.js, bez SSR).
 * Nie blokuje LCP: nagłówek hero renderuje serwer, kanwa dochodzi później.
 */
export const LazyHeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
