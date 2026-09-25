import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study Busy Bee. Copy 1:1 z `legacy/case-busybee-v3.html`.
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/busybee/${file}`,
  width,
  height,
  alt,
});

/** Adres żywej strony 1:1 z legacy (iframe i link w faktach). */
export const BUSYBEE_URL = "https://www.busybeefilm.pl";

export const busybee = {
  path: "/busy-bee",
  title: "Busy Bee",
  kind: "Strona WWW",
  kicker: "Strona WWW · 2024",
  tileLabel: "Busy Bee Film — dom produkcyjny",
  years: "2024",
  ownership: "client",
  summary: {
    role: "Design: Magda; kod spoza no-fuss: Michał Gabryelewicz (Webflow)",
    scope: "Projekt strony domu produkcyjnego",
    time: "2024",
    client: "Busy Bee Film, dom produkcyjny, Warszawa",
    result: { value: "Strona działa: busybeefilm.pl ↗", href: BUSYBEE_URL },
  },
  /* Klient, Magda i Kod z legacy są w `summary` (bez dublowania). */
  facts: [],
  /* Brief z `legacy/case-busybee-v1.html`; problem nie wynika z danych, więc „Zadanie”. */
  story: {
    problemTerm: "Zadanie",
    problem:
      "Busy Bee Film produkuje reklamy dla dużych marek. Strona ma robić jedno: pokazać prace i doprowadzić do kontaktu, bez zakładek, których nikt nie czyta.",
    done:
      "Magda zaprojektowała stronę: kadr z produkcji na pierwszym ekranie, realizacje w rytmie zamiast siatki kafelków, na końcu konkretne osoby z kontaktem. Kod i wdrożenie na Webflow: Michał Gabryelewicz.",
    effect: "Strona działa pod adresem busybeefilm.pl, na komputerze i na telefonie.",
  },
  description:
    "Projekt strony domu produkcyjnego Busy Bee Film (2024): design Magdy z no-fuss, kod Michał Gabryelewicz na Webflow. Strona działa pod busybeefilm.pl.",
  /* alt z kafla na stronie głównej (no-fuss-v5) */
  cover: img("d-00.webp", 1600, 1000, "Busy Bee Film: strona główna"),
  datePublished: "2024",
  about: "Busy Bee Film",
  next: getNextCase("/busy-bee"),
} as const satisfies CaseStudy;

/** Blok „Następny projekt” (tytuł 1:1 z legacy). */
export const busybeeNext = { href: busybee.next, title: "Automation House" } as const;

/** Żywa strona w ramce pod hero, ładowana po kliknięciu (poster + „Otwórz na żywo ↗”). */
export const busybeeLive = {
  src: BUSYBEE_URL,
  title: "Busy Bee Film, żywa strona",
  urlLabel: "www.busybeefilm.pl",
  /* Poster przed kliknięciem „Otwórz na żywo ↗” i fallback. */
  poster: busybee.cover,
  loadAriaLabel: "Załaduj żywą stronę busybeefilm.pl",
} as const;

/**
 * 02 / Stories: podpis sekcji. Marki na taśmie to klienci Busy Bee Film (ich reklamy),
 * nie klienci no-fuss: mówi to etykieta, podpowiedź i nazwa taśmy dla czytników.
 */
export const busybeeStoriesCaption = {
  label: "02 / Realizacje Busy Bee",
  hint: "Reklamy Busy Bee Film dla ich klientów, nie projekty no-fuss · przeciągnij taśmę",
  ariaLabel: "Reklamy Busy Bee Film dla ich klientów",
} as const;

/** 02 / Stories: taśma filmowa (kolejność 1:1 z legacy). */
export const busybeeStories = [
  { image: img("story-mercedesbenz.webp", 1400, 686, "Mercedes-Benz, reż. Augusto De Fraga"), title: "Mercedes-Benz", meta: "Augusto De Fraga" },
  { image: img("story-nescafe.webp", 900, 624, "Nescafé, reż. Jake Mavity"), title: "Nescafé", meta: "Jake Mavity" },
  { image: img("story-samsung.webp", 1350, 882, "Samsung, reż. Karol Kołodziński"), title: "Samsung", meta: "Karol Kołodziński" },
  { image: img("story-syoss.webp", 900, 624, "Syoss, reż. J.A.C.K"), title: "Syoss", meta: "J.A.C.K" },
  { image: img("story-mcdonald.webp", 900, 624, "McDonald’s, reż. Joakim Reveman"), title: "McDonald’s", meta: "Joakim Reveman" },
  { image: img("story-kikkoman.webp", 1350, 882, "Kikkoman, reż. Johnsen & Mona"), title: "Kikkoman", meta: "Johnsen & Mona" },
  { image: img("story-sudocrem.webp", 900, 623, "Sudocrem, reż. Julia Rogowska"), title: "Sudocrem", meta: "Julia Rogowska" },
  { image: img("story-kfc.webp", 900, 623, "KFC, reż. Jan & Raf Roosens"), title: "KFC", meta: "Jan & Raf Roosens" },
] as const;

/** 02 / Mobile: cała strona na telefonie. */
export const busybeePhone = {
  image: img("m-full.webp", 720, 11699, "Busy Bee Film na telefonie, cała strona"),
  label: "Cała strona Busy Bee na telefonie, przewijana",
} as const;

/** 03 / Fakty: wielkie wiersze. */
export const busybeeSpec = [
  { term: "Klient", value: "Busy Bee Film" },
  { term: "Zakres", value: "Strona domu produkcyjnego" },
  { term: "Design", value: "Magda" },
  { term: "Kod", value: "Michał Gabryelewicz", chip: "Webflow" },
  { term: "Kiedy", value: "2024" },
  { term: "Strona", value: "busybeefilm.pl ↗", href: BUSYBEE_URL },
] as const;
