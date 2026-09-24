/**
 * Sekcja „Jak pracujemy” na stronie głównej (`#proces`). Nowe copy (spoza legacy), wzorowane
 * na krokach procesu z case'u Automation House (`automationHouseSteps`), ale ogólne:
 * o współpracy z klientem, bez liczb i terminów, których nie mamy.
 */

const NBSP = " ";

export interface ProcessSectionStep {
  /** Numer mono, np. „01”. */
  no: string;
  title: string;
  /** 1–2 zdania. */
  text: string;
}

export const processSection = {
  label: "Jak pracujemy",
  counter: "01–04",
  steps: [
    {
      no: "01",
      title: `Rozmowa i${NBSP}brief`,
      text: `Zaczynamy od rozmowy: co chcecie zbudować, dla kogo i${NBSP}po co. Z niej powstaje brief i${NBSP}indywidualna wycena.`,
    },
    {
      no: "02",
      title: `Discovery i${NBSP}prototyp`,
      text: `Sprawdzamy, kto będzie z${NBSP}produktu korzystał i${NBSP}czego potrzebuje. Zanim powstanie kod, klikacie działający prototyp.`,
    },
    {
      no: "03",
      title: `Budowa w${NBSP}iteracjach`,
      text: `Design i${NBSP}kod idą w${NBSP}jednym zespole, małymi krokami. Regularnie pokazujemy działającą wersję, nie tylko efekt końcowy.`,
    },
    {
      no: "04",
      title: `Wdrożenie i${NBSP}wsparcie`,
      text: `Publikujemy stronę albo wydajemy aplikację i${NBSP}zostajemy dalej: poprawki, metryki, kolejne wersje.`,
    },
  ] satisfies readonly ProcessSectionStep[] as readonly ProcessSectionStep[],
};
