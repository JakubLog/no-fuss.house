import { Button } from "@/components/atoms/Button";
import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
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
 * Stopka (id `kontakt`): pełna wysokość, zawsze ciemna, nagłówek display
 * „Zróbmy coś razem, bez zamieszania”, „Umów rozmowę ↗” (kalendarz z `site.contact`)
 * z notką o odpowiedzi, e-mail (kopiowanie na myszy, `mailto:` na dotyku), social
 * (tylko prawdziwe linki), copyright. Cel CTA „Porozmawiajmy →”. Strefa naklejek spod
 * kursora. Server Component (Reveal i CopyEmail są klienckie).
 */
export function Footer() {
  return (
    <Reveal as="footer" id="kontakt" className={styles.footer} data-stickers="">
      <GlowBackdrop />
      <StickerLayer />
      <h2 className={styles.cta} aria-label="Zróbmy coś razem, bez zamieszania">
        <Line index={0} className={styles.l1}>
          Zróbmy
        </Line>
        <Line index={1} className={styles.l2}>
          coś razem,
        </Line>
        <Line index={2} className={styles.l3}>
          bez <Mark>zamieszania</Mark>
        </Line>
      </h2>
      <div className={cx("fade", styles.contact)} style={{ "--i": 3 }}>
        <Button href={site.contact.calendarUrl} variant="ghost" external data-cursor="calendar">
          {CONTACT_CTA_LABELS.calendar}
        </Button>
        {isPlaceholder(site.contact.responseNote) ? null : (
          <p className="mono-sm">{site.contact.responseNote}</p>
        )}
      </div>
      <div className={cx("mono", styles.bottom)}>
        <CopyEmail email={site.contact.email} className={styles.link} />
        <SocialLinks links={site.social} ariaLabel="Social" />
        <span>{site.copyright}</span>
      </div>
    </Reveal>
  );
}
