import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { ContactCta } from "@/components/molecules/ContactCta";
import { Reveal } from "@/components/organisms/Reveal";
import styles from "./PageHero.module.css";

export interface PageHeroProps {
  /** Linie `h1` w roli display (reveal ze staggerem). */
  lines: readonly string[];
  /** Lead w kroju statement (od 1024 px w kolumnach 9–12, dosunięty do dołu). */
  lead: string;
  /** `ContactCta` pod leadem (w tej samej kolumnie, stagger po leadzie). Domyślnie bez. */
  cta?: boolean;
}

/**
 * Jasne hero podstron (`/o-nas`, `/wiedza`; legacy `.team-hero` z o-nas-v5): nagłówek
 * display w liniach, lead w kroju statement i opcjonalnie CTA kontaktu. Odsłania się na
 * starcie wejścia (`Reveal trigger="intro"`). Server Component.
 */
export function PageHero({ lines, lead, cta = false }: PageHeroProps) {
  return (
    <Reveal as="section" trigger="intro" id="hero" className={`above-grid ${styles.hero}`}>
      <Heading as="h1" variant="display" lines={lines} className={styles.title} />
      <Fade as="p" index={lines.length} className={styles.lead}>
        {lead}
      </Fade>
      {cta ? <ContactCta index={lines.length + 1} className={styles.cta} /> : null}
    </Reveal>
  );
}
