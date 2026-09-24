/** Model podziału z onboardingu OurMoney. */
export type SplitModel = "prop" | "half" | "none";

export interface SplitResult {
  /** Procent Anny (zaokrąglony) albo `null` w trybie „Tylko śledzenie”. */
  percentA: number | null;
  /** Kwoty w zł albo `null` w trybie „Tylko śledzenie”. */
  shareA: number | null;
  shareB: number | null;
  /** Szerokość paska Anny w % (ograniczona do 28–72, żeby etykiety się mieściły). */
  barA: number;
}

/**
 * Liczymy tak samo jak aplikacja: najpierw zaokrąglony procent, potem kwota
 * (1:1 z legacy `case-ourmoney-v2.html`).
 */
export function computeSplit(model: SplitModel, incomeA: number, incomeB: number, total: number): SplitResult {
  if (model === "none") return { percentA: null, shareA: null, shareB: null, barA: 50 };
  const percentA = model === "prop" ? Math.round((incomeA / (incomeA + incomeB)) * 100) : 50;
  const shareA = (total * percentA) / 100;
  return {
    percentA,
    shareA,
    shareB: total - shareA,
    barA: Math.max(28, Math.min(72, percentA)),
  };
}

/**
 * „6 500 zł”: separator tysięcy zwykłą spacją, zawsze (także dla 4 cyfr).
 * Nie używamy `toLocaleString("pl-PL")`: CLDR dla pl nie grupuje liczb 4-cyfrowych
 * („6500”), a copy legacy i podpis mają „6 500”. Deterministyczne na serwerze i w przeglądarce.
 */
export function formatZl(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  const [int, frac] = String(Math.abs(rounded)).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${rounded < 0 ? "-" : ""}${grouped}${frac ? `,${frac.padEnd(2, "0")}` : ""} zł`;
}
