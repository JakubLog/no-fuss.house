import { Button } from "@/components/atoms/Button";
import { Line } from "@/components/atoms/Line";
import { Mark } from "@/components/atoms/Mark";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { CONTACT_CTA_LABELS } from "@/components/molecules/ContactCta";
import { CopyEmail } from "@/components/molecules/CopyEmail";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { isPlaceholder, site } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./Footer.module.css";

/**
 * Stopka (id `kontakt`): pełna wysokość, zawsze ciemna (płaskie `--hero-sky`, smugi są tylko
 * w hero), nagłówek display „Zróbmy coś razem, bez zamieszania” (reveal linii, na końcu limonka
 * „zamieszania” wjeżdża od prawej, gdy słowo jest w kadrze: własny `Reveal`), „Umów rozmowę ↗”
 * (kalendarz z `site.contact`, bez adresu go nie ma) z notką o odpowiedzi, e-mail (kopiowanie na
 * myszy, `mailto:` na dotyku), social (tylko prawdziwe linki), copyright; wszystko pod nagłówkiem
 * widoczne od razu. Cel CTA „Porozmawiajmy →”. Jedyna strefa naklejek spod kursora na stronach
 * treści. Server Component (Reveal i CopyEmail są klienckie).
 */
export function Footer() {
  const { calendarUrl, responseNote } = site.contact;
  const showNote = !isPlaceholder(responseNote);

  return (
    <Reveal as="footer" id="kontakt" className={styles.footer} data-stickers="">
      <StickerLayer />
      <h2 className={styles.cta} aria-label="Zróbmy coś razem, bez zamieszania">
        <Line index={0} className={styles.l1}>
          Zróbmy
        </Line>
        <Line index={1} className={styles.l2}>
          coś razem,
        </Line>
        <Line index={2} className={styles.l3}>
          bez{" "}
          <Reveal as="span" className={styles.word}>
            <Mark className={styles.mark}>zamieszania</Mark>
          </Reveal>
        </Line>
      </h2>
      {calendarUrl || showNote ? (
        <div className={styles.contact}>
          {calendarUrl ? (
            <Button href={calendarUrl} variant="ghost" external data-cursor="calendar">
              {CONTACT_CTA_LABELS.calendar}
            </Button>
          ) : null}
          {showNote ? <p className="mono-sm">{responseNote}</p> : null}
        </div>
      ) : null}
      <div className={cx("mono", styles.bottom)}>
        <CopyEmail email={site.contact.email} className={styles.link} />
        <SocialLinks links={site.social} ariaLabel="Social" />
        <span>{site.copyright}</span>
      </div>
    </Reveal>
  );
}
