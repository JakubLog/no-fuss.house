import { Button } from "@/components/atoms/Button";
import { isPlaceholder, site } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./ContactCta.module.css";

export interface ContactCtaProps {
  /** Indeks staggeru reveal (`.fade` + `--i`); bez niego blok jest widoczny od razu. */
  index?: number;
  /** Pokaż `site.contact.responseNote` pod przyciskami (placeholder `[…]` się nie renderuje). */
  note?: boolean;
  className?: string;
}

/** Etykiety CTA (nowe copy, decyzja Kuby: cel strony = kontakt z klientem usługowym). */
export const CONTACT_CTA_LABELS = {
  primary: "Porozmawiajmy →",
  calendar: "Umów rozmowę ↗",
} as const;

/**
 * CTA kontaktu: przycisk accent „Porozmawiajmy →” do stopki `#kontakt` i ghost
 * „Umów rozmowę ↗” do `site.contact.calendarUrl` (nowa karta). Bez adresu kalendarza
 * drugi przycisk jest linkiem-placeholderem (nieklikalny, opacity .5, „wkrótce” dla czytników).
 * Dane z `site.contact`. Server Component.
 */
export function ContactCta({ index, note = false, className }: ContactCtaProps) {
  const { calendarUrl, responseNote } = site.contact;
  const showNote = note && !isPlaceholder(responseNote);

  return (
    <div
      className={cx(styles.cta, index !== undefined && "fade", className)}
      style={index !== undefined ? { "--i": index } : undefined}
    >
      <div className={styles.actions}>
        <Button href="#kontakt">{CONTACT_CTA_LABELS.primary}</Button>
        <Button href={calendarUrl} variant="ghost" external data-cursor="calendar">
          {CONTACT_CTA_LABELS.calendar}
        </Button>
      </div>
      {showNote ? <p className={cx("mono-sm", styles.note)}>{responseNote}</p> : null}
    </div>
  );
}
