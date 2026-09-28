import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study Sassy. Copy 1:1 z `legacy/case-sassy-v2.html`.
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/sassy/${file}`,
  width,
  height,
  alt,
});

const NBSP = "\u00A0";

export const SASSY_URL = "https://sassy-tan.vercel.app";

export const sassy = {
  path: "/sassy",
  title: "Sassy",
  kind: "Eksperyment",
  kicker: "Eksperyment · 07.2026",
  tileLabel: "Sassy — strona bez celu",
  years: "2026",
  ownership: "own",
  summary: {
    role: "Koncept, design i kod: Magda",
    scope: "Strona-eksperyment bez celu, w jednym pliku",
    time: "07.2026",
    result: { value: "Strona działa: sassy-tan.vercel.app ↗", href: SASSY_URL },
  },
  /* „Magda” z legacy jest w `summary.role`. */
  facts: [
    { term: "Typ", value: "Projekt własny, eksperyment" },
    { term: "Stack", value: "Jeden plik HTML" },
  ],
  /* Z `legacy/case-sassy-v1.html`. Eksperyment bez briefu klienta, więc „Zadanie”. */
  story: {
    problemTerm: "Zadanie",
    problem:
      "Warsztat, nie zlecenie: „a page with no objectives”. Magda sprawdza na niej, ile zabawy i interakcji udźwignie jedna strona w jednym pliku HTML, bez frameworków.",
    done:
      "Wszystko da się złapać i przesunąć: karty, nagłówki, litery. Retro pulpit z aparatem, biurko z zadaniami, suwak godzin, waga SERIOUS, tablica z kredą i gra Snack Run.",
    effect:
      "Strona działa pod adresem sassy-tan.vercel.app, także dotykiem. Kamera startuje tylko po kliknięciu, obraz nie opuszcza przeglądarki.",
  },
  description:
    "Sassy, eksperyment Magdy z no-fuss (07.2026): strona bez celu w jednym pliku HTML, na której wszystko da się złapać i przesunąć. Warsztat interakcji.",
  /* alt z kafla na stronie głównej (no-fuss-v5) */
  cover: img("d-00.webp", 1600, 1000, "Sassy: strona bez celu"),
  datePublished: "2026-07",
  about: "Sassy — strona bez celu",
  next: getNextCase("/sassy"),
} as const satisfies CaseStudy;

export const sassyNext = { href: sassy.next, title: "OurMoney" } as const;

export const sassyLive = {
  src: SASSY_URL,
  title: "Sassy, żywa strona",
  urlLabel: "sassy-tan.vercel.app",
  poster: img("d-00.webp", 1600, 1000, "Sassy"),
  loadLabel: "Otwórz na żywo ↗",
  loadAriaLabel: "Załaduj żywą stronę sassy-tan.vercel.app",
} as const;

/** 01 / Zabawki: przełącznik (kolejność, podpisy i alt 1:1 z legacy). */
export const sassyToysTitle = "Wszystko da się złapać";

export const sassyToys = [
  { name: "Pulpit", tag: "kamera", caption: "Retro pulpit: foldery do przeciągania, aparat robi zdjęcie", image: img("d-00.webp", 1600, 1000, "Pulpit") },
  { name: "Biurko", tag: "bento", caption: "Zadania, OKR-y, wykres, ekspres do kawy", image: img("d-01.webp", 1600, 1000, "Biurko") },
  { name: "Business case", tag: "suwak", caption: `220${NBSP}h miesięcznie i karta zapala się na czerwono`, image: img("d-02.webp", 1600, 1000, "Business case") },
  { name: "Waga", tag: "SERIOUS", caption: "Słowo na zmiennym kroju, do rozchudzenia", image: img("d-04.webp", 1600, 1000, "Waga") },
  { name: "Karteczki", tag: "tablica", caption: "Kreda, gąbka, karteczki", image: img("d-06.webp", 1600, 1000, "Karteczki") },
  { name: "Identyfikator", tag: "koszulka", caption: "Karta w folii z podpisami odręcznymi", image: img("d-07.webp", 1600, 1000, "Identyfikator") },
  { name: "Koniec", tag: "gra", caption: "Snack Run w retro komputerze", image: img("d-09.webp", 1600, 1000, "Koniec") },
] as const;

/** 02 / Mobile: dwa statyczne ekrany 390 px. */
export const sassyMobile = [
  img("m-00.webp", 780, 1688, "Widok mobilny, hero"),
  img("m-03.webp", 780, 1688, "Widok mobilny, dalsza część"),
] as const;

/** 03 / Fakty: kafle (legacy `.facts`). */
export const sassySpec = [
  { term: "Koncept, design, kod", value: "Magda" },
  { term: "Stack", value: `HTML · CSS · JS, 1${NBSP}plik` },
  { term: "Kiedy", value: "Lipiec 2026" },
  { term: "Strona", value: "sassy-tan.vercel.app ↗", href: SASSY_URL },
] as const;
