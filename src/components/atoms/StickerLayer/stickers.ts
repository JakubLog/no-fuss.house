/**
 * Naklejki SVG 1:1 z legacy (`STICKERS` / `window.NF_STICKERS`).
 * Jedyna zmiana: `font-family` przez `style` z tokenami `--sans` / `--mono`,
 * bo next/font nadaje krojom własne nazwy rodzin.
 *
 * Statyczne, zaufane stringi: wstawiane przez `innerHTML` (Cursor) albo
 * `dangerouslySetInnerHTML` (np. przeciągane naklejki na /o-nas).
 */
export const STICKERS: readonly string[] = [
  /* odznaka NO FUSS */ `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#BBFF00" stroke="#fff" stroke-width="6"/><circle cx="50" cy="50" r="41" fill="none" stroke="#000" stroke-width="2"/><text x="50" y="47" text-anchor="middle" style="font-family:var(--sans)" font-weight="800" font-size="21" fill="#000">NO</text><text x="50" y="68" text-anchor="middle" style="font-family:var(--sans)" font-weight="800" font-size="21" fill="#000">FUSS</text></svg>`,
  /* piorun */ `<svg viewBox="0 0 100 100"><path d="M58 6 18 56h26l-8 38 46-54H54z" fill="#FFFFFF" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke"/><path d="M58 6 18 56h26l-8 38 46-54H54z" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="round"/></svg>`,
  /* buźka */ `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#FCFCFB" stroke="#fff" stroke-width="7"/><circle cx="50" cy="50" r="40" fill="#FCFCFB" stroke="#000" stroke-width="2.5"/><ellipse cx="37" cy="42" rx="5" ry="8"/><ellipse cx="63" cy="42" rx="5" ry="8"/><path d="M30 62c8 12 32 12 40 0" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/></svg>`,
  /* metka 2026 */ `<svg viewBox="0 0 120 70"><rect x="6" y="10" width="108" height="50" rx="10" fill="#FF5C8A" stroke="#fff" stroke-width="7" paint-order="stroke"/><rect x="6" y="10" width="108" height="50" rx="10" fill="none" stroke="#000" stroke-width="2"/><text x="60" y="46" text-anchor="middle" style="font-family:var(--mono)" font-weight="500" font-size="28" fill="#000">2026</text></svg>`,
  /* gwiazda OK */ `<svg viewBox="0 0 100 100"><path d="M50 4l11 18 20-6 1 21 19 9-13 16 8 20-21 1-9 19-16-13-20 8-1-21L10 67l13-16-8-20 21-1z" fill="#101318" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" style="font-family:var(--sans)" font-weight="800" font-size="26" fill="#BBFF00">OK</text></svg>`,
];
