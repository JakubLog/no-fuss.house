/** `true` dla ścieżek obsługiwanych przez router Next (`/…`, ale nie `//host`). */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/** Atrybuty linku zewnętrznego z `SocialLink` / `FindItem` (`href: null` = placeholder). */
export type ExternalLinkProps =
  | { href: string; target: "_blank"; rel: "noopener" }
  | { href: "#"; "aria-disabled": "true" };

/**
 * Jedno zachowanie linków-placeholderów w całym UI (stopka, karty osób, `/o-nas#social`, `#posty`):
 * `href: null` → `href="#"` + `aria-disabled="true"`, bez `target`. Link zostaje w kolejności Tab
 * i wygląda jak w legacy, a czytnik ogłasza go jako niedostępny. Prawdziwy adres → nowa karta.
 */
export function externalLinkProps(href: string | null): ExternalLinkProps {
  return href ? { href, target: "_blank", rel: "noopener" } : { href: "#", "aria-disabled": "true" };
}
