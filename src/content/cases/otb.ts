import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study OTB Ventures. Copy 1:1 z `legacy/case-otb-v2.html`
 * (bez przełącznika sekcji, przewijany telefon, fakty jako wiersze).
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/otb/${file}`,
  width,
  height,
  alt,
});

export const OTB_URL = "https://otb.vc";

export const otb = {
  path: "/otb",
  title: "OTB Ventures",
  kind: "Strona WWW",
  kicker: "Strona WWW · 06.2025",
  tileLabel: "OTB Ventures",
  years: "2025",
  ownership: "client",
  summary: {
    role: "Design: Magda razem z Piotrem Chuchłą",
    scope: "Projekt strony funduszu VC",
    time: "06.2025",
    client: "OTB Ventures, fundusz VC, Amsterdam / Warszawa",
    result: { value: "Strona działa: otb.vc ↗", href: OTB_URL },
  },
  /* Klient i Design z legacy są w `summary`. Kod: brak danych (w legacy placeholder), wiersz pominięty. */
  facts: [{ term: "Stack", value: "WordPress" }],
  /* Brief z `legacy/case-otb-v1.html`; problem nie wynika z danych, więc „Zadanie”. */
  story: {
    problemTerm: "Zadanie",
    problem:
      "OTB Ventures inwestuje w europejskie startupy z AI, SpaceTech i Physical AI. Strona ma być poważna jak fundusz i odważna jak jego portfolio.",
    done:
      "Magda z Piotrem Chuchłą zaprojektowali stronę wokół jednego elementu: gradientu czerwień–błękit i kuli, która przecina nagłówek „Open to beyond”. Do tego wertykale, portfolio, opinie founderów i widok mobilny.",
    effect: "Strona działa pod adresem otb.vc, na WordPressie.",
  },
  description:
    "Projekt strony funduszu VC OTB Ventures (06.2025): design Magdy z no-fuss razem z Piotrem Chuchłą, gradient i kula „Open to beyond”. Strona na WordPressie.",
  /* alt z kafla na stronie głównej (no-fuss-v5) */
  cover: img("d-00.webp", 1600, 1000, "OTB Ventures: strona główna"),
  datePublished: "2025-06",
  about: "OTB Ventures",
  next: getNextCase("/otb"),
} as const satisfies CaseStudy;

export const otbNext = { href: otb.next, title: "Sassy" } as const;

/** Żywa strona ładowana po kliknięciu (poster + „Otwórz na żywo ↗”, 1:1 z legacy). */
export const otbLive = {
  src: OTB_URL,
  title: "OTB Ventures, żywa strona",
  urlLabel: "otb.vc",
  poster: img("d-00.webp", 1600, 1000, "OTB Ventures"),
  loadLabel: "Otwórz na żywo ↗",
  loadAriaLabel: "Załaduj żywą stronę otb.vc",
} as const;

/** 01 / Hero: rekonstrukcja hero otb.vc z przeciąganą kulą. */
export const otbBall = {
  label: "Rekonstrukcja hero otb.vc: przeciągnij kulę, gradient idzie za nią",
  words: ["Open to", "beyond"],
  caption: "Open to beyond · rekonstrukcja w HTML",
  ballLabel: "Kula",
} as const;

export const otbPhone = {
  image: img("m-full.webp", 720, 13756, "OTB Ventures na telefonie, cała strona"),
  label: "Cała strona OTB na telefonie, przewijana",
} as const;

export const otbSpec = [
  { term: "Klient", value: "OTB Ventures" },
  { term: "Zakres", value: "Strona funduszu VC" },
  { term: "Design", value: "Piotr Chuchła + Magda" },
  /* Placeholder z legacy: nie renderuje się (`publishedSpec()`), wraca, gdy będzie wiadomo, kto kodował. */
  { term: "Kod", value: "[placeholder]", chip: "WordPress" },
  { term: "Kiedy", value: "Czerwiec 2025" },
  { term: "Strona", value: "otb.vc ↗", href: OTB_URL },
] as const;
