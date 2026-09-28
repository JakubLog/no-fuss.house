import { hasPlaceholder } from "./site";
import type { FaqItem, FaqMore } from "./types";

/**
 * FAQ strony głównej (`#faq`). Nowe copy (spoza legacy), fakty tylko z repo
 * (`site.ts`, `about.ts`, `cases/*`, `home.ts`). Decyzja Kuby: bez widełek i cennika,
 * każde zlecenie wyceniamy indywidualnie.
 *
 * Odpowiedź z placeholderem `[…]` (dana do potwierdzenia przez Kubę) nie renderuje się
 * ani na stronie, ani w JSON-LD (`publishedFaq()`).
 */

const NBSP = " ";

export const faqSection = {
  label: "Częste pytania",
  /** Zdanie pod listą (przed stopką `#kontakt`): „na rozmowie” to link do formularza w stopce. */
  more: {
    before: "Nie ma tu Waszego pytania? Zadajcie je ",
    link: { label: "na rozmowie", href: "#kontakt" },
    after: ".",
  } satisfies FaqMore,
  items: [
    {
      question: "Ile kosztuje projekt?",
      answer: `Do każdego zlecenia podchodzimy indywidualnie, dlatego nie mamy cennika. Cena zależy od zakresu: po krótkiej rozmowie i${NBSP}briefie przygotowujemy wycenę.`,
    },
    {
      question: "Ile to trwa?",
      answer: `Zależy od zakresu. Termin podajemy razem z${NBSP}wyceną, kiedy wiemy już, co dokładnie budujemy.`,
    },
    {
      question: "Jak zacząć współpracę?",
      answer: `Od rozmowy: opowiadacie, co chcecie zbudować albo poprawić. Potem przygotowujemy brief i${NBSP}wycenę, a po akceptacji ruszamy z${NBSP}discovery.`,
    },
    {
      question: "Kto pracuje nad projektem?",
      answer: `Magda (design i${NBSP}produkt) i${NBSP}Kuba (kod) razem z${NBSP}agentami AI, które pomagają od researchu po code review. Nad pracą AI zawsze czuwa człowiek: Magda albo Kuba.`,
    },
    {
      question: "W czym budujecie?",
      answer: `Strony w${NBSP}Next.js, z${NBSP}CMS do samodzielnej edycji. Aplikacje w${NBSP}React i${NBSP}TypeScript, na telefony przez Capacitor, z${NBSP}Supabase jako backendem (tak powstaje OurMoney). Integrujemy się z${NBSP}narzędziami, których już używacie.`,
    },
    {
      question: "Do kogo należy kod i design?",
      answer: "[Do Was. Po rozliczeniu przekazujemy prawa autorskie, repozytorium i pliki projektowe. Do potwierdzenia przez Kubę.]",
    },
    {
      question: "Robicie tylko design albo tylko development?",
      answer: `Tak. Najwięcej dajemy, prowadząc projekt od designu do kodu, ale bierzemy też jedno z${NBSP}dwóch. Stronę Busy Bee Film zaprojektowała Magda, a${NBSP}zakodował ją Michał Gabryelewicz w${NBSP}Webflow.`,
    },
    {
      question: "Możecie poprawić produkt, który już mamy?",
      answer: `Tak. Zaczynamy od audytu: UX, dostępność, konwersja, kod. Dostajecie listę priorytetów, a${NBSP}potem możemy je razem wdrożyć.`,
    },
  ] satisfies readonly FaqItem[] as readonly FaqItem[],
};

/** Pytania gotowe do publikacji (bez placeholderów `[…]`): UI i JSON-LD `FAQPage`. */
export function publishedFaq(): readonly FaqItem[] {
  return faqSection.items.filter((item) => !hasPlaceholder(item.question) && !hasPlaceholder(item.answer));
}
