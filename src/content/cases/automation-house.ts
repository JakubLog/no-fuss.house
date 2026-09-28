import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study Automation House. Copy 1:1 z `legacy/case-automation-house-v1.html`.
 * Automation House by Tigers to pracodawca Kuby (etat), nie klient no-fuss (decyzja właściciela).
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/automation-house/${file}`,
  width,
  height,
  alt,
});

/** Adres żywej strony 1:1 z legacy. */
export const AUTOMATION_HOUSE_URL = "https://www.automation.house";

export const automationHouse = {
  path: "/automation-house",
  title: "Automation House",
  kind: "Strona WWW",
  kicker: "Strona WWW · Etat Kuby · 06.2026",
  tileLabel: "Automation House — etat Kuby",
  years: "2026",
  ownership: "employment",
  employer: { name: "Automation House by Tigers", url: AUTOMATION_HOUSE_URL, employee: "kuba" },
  /* Bez `client`: Automation House to pracodawca Kuby, nie klient no-fuss. */
  summary: {
    role: "Kod: Kuba (etat w Automation House), design: Magda",
    scope: "Rebranding strony: od discovery do wdrożenia",
    time: "06.2026",
    result: { value: "Strona działa: automation.house ↗", href: AUTOMATION_HOUSE_URL },
  },
  /* Magda i Kuba z legacy są w `summary`; „Dla AI” z faktów legacy. */
  facts: [{ term: "Dla AI", value: "Czytelna dla scraperów AI" }],
  /* Z kroków procesu legacy; problem nie wynika z danych, więc „Zadanie”. */
  story: {
    problemTerm: "Zadanie",
    problem:
      "Rebranding strony Automation House by Tigers: ustalić, co firma robi naprawdę i komu to sprzedaje, i pokazać to na nowej stronie.",
    done:
      "Warsztaty i rozmowy z zespołem, potrzeby osób odwiedzających stronę, nowa architektura treści, system wizualny i ekrany (Magda), kod w Next.js (Kuba). Struktura i treść czytelne także dla AI.",
    effect: "Nowa strona działa pod adresem automation.house.",
  },
  description:
    "Rebranding strony Automation House by Tigers (06.2026), pracodawcy Kuby: kod w Next.js (Kuba, na etacie), design (Magda). Strona czytelna także dla AI.",
  /* alt z kafla na stronie głównej (no-fuss-v5) */
  cover: img("d-00.webp", 1400, 875, "Automation House: strona główna"),
  datePublished: "2026-06",
  about: "Automation House by Tigers",
  next: getNextCase("/automation-house"),
} as const satisfies CaseStudy;

export const automationHouseNext = { href: automationHouse.next, title: "OTB Ventures" } as const;

/** Żywa strona w ramce pod hero, ładowana po kliknięciu (poster + „Otwórz na żywo ↗”). */
export const automationHouseLive = {
  src: AUTOMATION_HOUSE_URL,
  title: "Automation House, żywa strona",
  urlLabel: "www.automation.house",
  poster: automationHouse.cover,
  loadAriaLabel: "Załaduj żywą stronę automation.house",
} as const;

/** 01 / Proces: rebranding, discovery → AI-ready (1:1 z legacy). */
export const automationHouseSteps = [
  { title: "Discovery", text: "Warsztaty i rozmowy z zespołem: co firma robi naprawdę i komu to sprzedaje." },
  { title: "Potrzeby", text: "Kto wchodzi na stronę, czego szuka i co ma zrobić dalej." },
  { title: "Projekt", text: "Nowa architektura treści, system wizualny, ekrany." },
  { title: "Kod", text: "Next.js, szybkie, dostępne. Kuba." },
  { title: "AI-ready", text: "Struktura i treść czytelne dla AI scraperów, nie tylko dla Google." },
] as const;

export const automationHousePhone = {
  image: img("m-full.webp", 518, 16000, "Automation House na telefonie, cała strona"),
  label: "Cała strona Automation House na telefonie, przewijana",
} as const;

export const automationHouseSpec = [
  { term: "Firma", value: "Automation House by Tigers" },
  { term: "Zakres", value: "Rebranding strony" },
  { term: "Design", value: "Magda" },
  { term: "Kod", value: "Kuba", chip: "Next.js" },
  { term: "Dla AI", value: "Czytelna dla scraperów AI" },
  { term: "Kiedy", value: "Czerwiec 2026" },
  { term: "Strona", value: "automation.house ↗", href: AUTOMATION_HOUSE_URL },
] as const;
