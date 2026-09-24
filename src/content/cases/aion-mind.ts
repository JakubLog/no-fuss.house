import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study AION MIND. Copy 1:1 z `legacy/case-aion-mind-v1.html`.
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/aion-mind/${file}`,
  width,
  height,
  alt,
});

export const aionMindImages = {
  /** Okładka / OG / pasek pod hero (1200×630). */
  og: img("og-image.png", 1200, 630, "AION MIND: przewodnicy i ekrany aplikacji"),
  /** 03.2 / Amfiteatr Wiedzy (zrzut ma już ramkę telefonu). */
  context: img("context-phone.png", 450, 921, "Ekran Amfiteatr Wiedzy: zebrany kontekst, 100 procent"),
} as const;

/** 03.3 / Przewodnicy. */
export const aionMindGuides = [
  { name: "Herodot", role: "Zbiera i strukturyzuje wiedzę o Tobie", image: img("herodot.png", 480, 480, "Przewodnik Herodot") },
  { name: "Strateg", role: "Pomaga odkryć praprzyczynę problemu", image: img("strateg.png", 481, 480, "Przewodnik Strateg") },
  { name: "Empatia", role: "Łagodnie wspiera w trudnych sytuacjach", image: img("empatia.png", 481, 480, "Przewodnik Empatia") },
  { name: "Kowal", role: "Buduje nawyki i pilnuje produktywności", image: img("kowal.png", 480, 480, "Przewodnik Kowal") },
  {
    name: "Trenerka mentalna",
    role: "Wzmacnia odporność psychiczną i motywację",
    image: img("trenerka.png", 120, 120, "Przewodnik Trenerka mentalna"),
  },
] as const;

/** 04 / Rola: dwa etapy. */
export const aionMindPath = [
  { when: "01.2025 – 05.2026 · Etap 1", title: "Product Designer", scope: "Koncepcja, flow, system wizualny, ekrany" },
  { when: "Od czerwca 2026 · Etap 2, trwa", title: "Head of Operations", scope: "Produkt, priorytety, praca z zespołem dev" },
] as const;

/**
 * 05 / W liczbach. Czwarta liczba to placeholder 1:1 z legacy: zostaje w danych, ale się nie renderuje
 * (`publishedNumbers()` w `cases/index.ts`). Wróci, gdy Magda poda liczbę.
 */
export const aionMindNumbers = [
  { value: 5, label: "przewodników o różnych rolach", accent: true },
  { value: 3, label: "platformy: iOS, Android, web" },
  { value: 2, label: "rytmy podsumowań: tydzień i miesiąc" },
  { value: "[?]", label: "[Liczba do wyboru przez Magdę, np. ocena w sklepach]" },
] as const;

/** Adres produktu (AION MIND nie jest produktem no-fuss, więc nie ma go w `products` w `site.ts`). */
export const AION_MIND_URL = "https://aionmind.com";

/** Opis aplikacji (lead z legacy) dla `SoftwareApplication` w JSON-LD. */
export const aionMindAppDescription = "Aplikacja do journalingu z AI, która pamięta Twój kontekst.";

export const aionMindStores = {
  appStore: "https://apps.apple.com/pl/app/aion-mind/id6753288406",
  googlePlay: "https://play.google.com/store/apps/details?id=com.aion.aionmind",
} as const;

export const aionMind = {
  path: "/aion-mind",
  title: "AION MIND",
  kind: "Aplikacja mobilna",
  /* AION MIND to etat Magdy, nie produkt ani zlecenie no-fuss (decyzja Kuby). */
  kicker: "Etat Magdy · 01.2025 → teraz",
  lead: "Aplikacja do journalingu z AI, którą Magda współtworzy na etacie.",
  tileLabel: "AION MIND — etat Magdy",
  years: "2025–2026",
  ownership: "employment",
  employer: { name: "AION MIND", url: AION_MIND_URL, employee: "magda" },
  summary: {
    role: "— (etat Magdy, nie projekt no-fuss)",
    scope: "Design produktu, potem cały produkt i zespół",
    time: "01.2025 → teraz",
  },
  facts: [
    { term: "Magda", value: "Product Designer 01.2025–05.2026, od czerwca 2026 Head of Operations" },
    { term: "Platformy", value: "iOS · Android · web" },
    { term: "App Store", value: "Pobierz ↗", href: aionMindStores.appStore },
    { term: "Google Play", value: "Pobierz ↗", href: aionMindStores.googlePlay },
    { term: "Zobacz", value: "aionmind.com ↗", href: AION_MIND_URL },
  ],
  description:
    "AION MIND, aplikacja do journalingu z AI. Magda pracuje w niej na etacie: od 01.2025 jako Product Designer, od czerwca 2026 jako Head of Operations.",
  cover: aionMindImages.og,
  datePublished: "2025-01",
  about: "Journaling z AI",
  next: getNextCase("/aion-mind"),
} as const satisfies CaseStudy;
