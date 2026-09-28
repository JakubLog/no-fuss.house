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
  /** Showreel pod hero: czyste ujęcia UI (mockups/aion-mind-app/aion-mind-clean-motion-v1.html, 16:9). */
  showreel: {
    src: "/assets/aion-mind/showreel.mp4",
    poster: "/assets/aion-mind/showreel-poster.jpg",
    alt: "Showreel AION MIND: przewodnicy, rozmowa, dziennik i Amfiteatr Wiedzy o różnych porach dnia",
    width: 1600,
    height: 900,
  },
} as const;

/** 03.3 / Przewodnicy. Portrety v2 z appki (pierwsza klatka `assets/assistant/animations/avatar-v2/{guide}/afternoon.mp4`, automationhouse/AION main, 28.09.2026). */
export const aionMindGuides = [
  { name: "Herodot", role: "Zbiera i strukturyzuje wiedzę o Tobie", image: img("guide-herodot.jpg", 480, 480, "Przewodnik Herodot") },
  { name: "Strateg", role: "Pomaga odkryć praprzyczynę problemu", image: img("guide-strateg.jpg", 480, 480, "Przewodnik Strateg") },
  { name: "Empatia", role: "Łagodnie wspiera w trudnych sytuacjach", image: img("guide-empatia.jpg", 480, 480, "Przewodnik Empatia") },
  { name: "Kowal Produktywności", role: "Buduje nawyki i pilnuje produktywności", image: img("guide-kowal.jpg", 480, 480, "Przewodnik Kowal Produktywności") },
  {
    name: "Trenerka mentalna",
    role: "Wzmacnia odporność psychiczną i motywację",
    image: img("guide-trenerka-mentalna.jpg", 480, 480, "Przewodnik Trenerka mentalna"),
  },
] as const;

/**
 * 04 / Ewolucja: od szkieletu do 1.0. Ekrany z Figmy Magdy (plik „AION MIND – shadcn ui kit”,
 * strony Makiety, AION MIND 0.1 i 1.0), eksport 28.09.2026. Daty tylko tam, gdzie są zapisane w pliku.
 */
export const aionMindEvolution = [
  {
    when: "v0.1 · makiety",
    title: "Szkielet",
    text: "Dwie drogi na start: rozmowa z asystentem albo wpis w dzienniku. Treść przed formą.",
    image: img("evo-v01-home.jpg", 786, 1704, "AION MIND v0.1: szkic ekranu głównego z pytaniem Czym się dzisiaj zajmiemy?"),
  },
  {
    when: "v0.5 · 07.2025",
    title: "Rozmowa z imieniem",
    text: "Przewodnik zamiast bota: Strateg odpowiada na głosówkę i proponuje plan działania.",
    image: img("evo-v05-chat.jpg", 786, 1704, "AION MIND v0.5: makieta rozmowy ze Strategiem"),
  },
  {
    when: "0.1 · pierwsze wydanie",
    title: "Twarz przewodnika",
    text: "Malowane portrety greckich przewodników i jedno pole odpowiedzi z zapisem refleksji.",
    image: img("evo-impl-chat.jpg", 786, 1704, "AION MIND 0.1: rozmowa z Herodotem z portretem przewodnika"),
  },
  {
    when: "1.0 · 2026",
    title: "Jeden krok do refleksji",
    text: "Ekran główny to scena i karuzela przewodników z jednym przyciskiem: Rozpocznij refleksję.",
    image: img("evo-v10-home.jpg", 786, 1704, "AION MIND 1.0: ekran główny ze Strategiem na tle morza i latarni"),
  },
  {
    when: "1.0 · pory dnia",
    title: "Aplikacja żyje z dniem",
    text: "Świt, dzień i noc zmieniają paletę całego interfejsu, także rozmowy.",
    image: img("evo-v10-chat.jpg", 786, 1717, "AION MIND 1.0: rozmowa z Herodotem w porannej palecie"),
  },
] as const;

/** 05 / Rola: dwa etapy. */
export const aionMindPath = [
  { when: "01.2025 – 05.2026 · Etap 1", title: "Product Designer", scope: "Koncepcja, flow, system wizualny, ekrany" },
  { when: "Od czerwca 2026 · Etap 2, trwa", title: "Head of Operations", scope: "Produkt, priorytety, praca z zespołem dev" },
] as const;

/**
 * 06 / W liczbach.
 */
export const aionMindNumbers = [
  /* Liczone z Figmy 28.09.2026: ramki telefonu 360–440 px na stronach Makiety, Archiwalny Design, 0.1 i 1.0 (z wariantami i odrzuconymi). */
  { value: "1700+", label: "ekranów i wariantów w Figmie", accent: true },
  { value: 5, label: "przewodników o różnych rolach" },
  { value: 3, label: "pory dnia zmieniające cały interfejs" },
  { value: 2, label: "rytmy podsumowań: tydzień i miesiąc" },
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
