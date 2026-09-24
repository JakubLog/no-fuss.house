import { getNextCase } from "../routes";
import type { CaseStudy, CaseStudyImage } from "../types";

/**
 * Case study OurMoney. Copy 1:1 z `legacy/case-ourmoney-v2.html`.
 * Wymiary obrazów zmierzone `sips` (realne piksele plików w `public/`).
 * Ten sam plik ma w legacy różne `alt` zależnie od miejsca, dlatego obrazy są per użycie.
 */

const img = (file: string, width: number, height: number, alt: string): Required<CaseStudyImage> => ({
  src: `/assets/ourmoney/${file}`,
  width,
  height,
  alt,
});

export const ourmoneyImages = {
  /** Okładka / OG (1200×630). */
  og: img("og-image.png", 1200, 630, "Grafika ourmoney.pl: Razem ogarnijcie finanse"),
  /** Pasek pod hero: trzy ekrany na limonce. */
  stage: [
    img("koperty.png", 388, 895, "Ekran Koperty: planowane wydatki i budżet miesięczny"),
    img("ekran-glowny-rownowaga.webp", 415, 903, "Ekran główny: czyja kolej na płacenie i ostatnie transakcje"),
    img("strona-glowna.png", 391, 898, "Ekran główny: budżet miesiąca, transakcje i koperty"),
  ],
  /** 03.1 / Ekran główny. */
  home: img("ekran-glowny-rownowaga.webp", 415, 903, "Ekran główny OurMoney: kolej Wiktorii na płacenie, 223 zł"),
  /** 03.2 / Onboarding: fragment ustawień pod kalkulatorem. */
  rules: img(
    "zasady-podzialu.png",
    391,
    202,
    "Fragment ustawień OurMoney: Nasze zasady, po równo, proporcjonalnie, tylko śledzenie",
  ),
} as const;

/** 03.5 / Codzienność: zrzuty z aplikacji z podpisami. */
export const ourmoneyScreens = [
  {
    image: img("dodawaj-prosto-wydatki.png", 387, 895, "Dodawanie wydatku: kwota, koperta, kto zapłacił, skan paragonu"),
    caption: "Wydatek w kilka sekund, także ze skanu paragonu",
  },
  {
    image: img("koperty.png", 388, 895, "Koperty: planowane i nieplanowane wydatki"),
    caption: "Koperty: plan kontra rzeczywistość",
  },
  {
    image: img("wspolne-cele.png", 390, 844, "Lista wspólnych celów: Wakacje w Palermo"),
    caption: "Wspólne cele oszczędnościowe",
  },
  {
    image: img("wspolne-cele-finansowe.webp", 413, 901, "Cel Wakacje: wkład każdej osoby przy podziale 50/50"),
    caption: "Cel z widocznym wkładem obojga",
  },
] as const;

/** 05 / W liczbach. */
export const ourmoneyNumbers = [
  { value: 13, label: "kroków onboardingu, tryb solo albo we dwoje", accent: true },
  { value: 3, label: "modele podziału zamiast jednego „po połowie”" },
  { value: 30, label: "dni pełnego triala, czyli jeden cykl rozliczenia" },
  { value: 152, label: "polityki bezpieczeństwa na poziomie bazy danych" },
] as const;

/** 06 / Pod maską. */
export const ourmoneyStack = [
  {
    label: "Aplikacja",
    items: ["React", "TypeScript", "Vite", "Tailwind", "Supabase", "TanStack Query", "Capacitor", "Vercel"],
  },
  { label: "Landing", items: ["Next.js 15", "next-intl", "Sanity", "Tailwind 4"] },
  { label: "Płatności i analityka", items: ["RevenueCat", "Stripe", "PostHog"] },
] as const;

export const ourmoney = {
  path: "/ourmoney",
  title: "OurMoney",
  kind: "Aplikacja mobilna",
  kicker: "Aplikacja mobilna · 12.2025 → teraz",
  lead: "Aplikacja, która odpowiada parze na jedno pytanie: czy to jest fair?",
  tileLabel: "OurMoney — wspólny budżet dla par",
  years: "2025–2026",
  ownership: "own",
  summary: {
    role: "Produkt własny Magdy i Kuby",
    scope: "Design i produkt (Magda), kod, infrastruktura i bezpieczeństwo (Kuba)",
    time: "12.2025 → teraz",
  },
  /* Magda i Kuba z legacy są w `summary.scope`. Wynik: brak (przed premierą), jest „Status”. */
  facts: [
    { term: "Status", value: "W budowie, przed premierą w sklepach" },
    { term: "Platformy", value: "PWA · iOS i Android w przygotowaniu" },
    { term: "Dla kogo", value: "Pary 25–40, Polska i UE" },
    { term: "Zobacz", value: "ourmoney.pl ↗", href: "https://ourmoney.pl" },
  ],
  description:
    "OurMoney, produkt własny no-fuss: aplikacja do wspólnego budżetu dla par. Magda projektuje i prowadzi produkt, Kuba koduje. Przed premierą w sklepach.",
  cover: ourmoneyImages.og,
  datePublished: "2025-12",
  about: "Wspólny budżet dla par",
  next: getNextCase("/ourmoney"),
} as const satisfies CaseStudy;
