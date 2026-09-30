import Link from "next/link";
import { Line } from "@/components/atoms/Line";
import { Mark } from "@/components/atoms/Mark";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { ContactForm } from "@/components/molecules/ContactForm";
import { CopyEmail } from "@/components/molecules/CopyEmail";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { privacyLink, termsLink } from "@/content/legal";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./Footer.module.css";

/**
 * Stopka (id `kontakt`): min. pełna wysokość, zawsze ciemna (płaskie `--hero-sky`, smugi są tylko
 * w hero), nagłówek display „Zróbmy coś razem, bez zamieszania” (reveal linii, na końcu limonka
 * „zamieszania” wjeżdża od prawej, gdy słowo jest w kadrze: własny `Reveal`), pod nim `ContactForm`
 * (wysyłka, „Umów rozmowę ↗” z `site.contact.calendarUrl`, notka o odpowiedzi), na dole e-mail
 * (kopiowanie na myszy, `mailto:` na dotyku), social (tylko prawdziwe linki), regulamin i polityka prywatności, copyright; wszystko pod
 * nagłówkiem widoczne od razu. Cel CTA „Porozmawiajmy →”. Jedyna strefa naklejek spod kursora na stronach
 * treści. Server Component (Reveal, ContactForm i CopyEmail są klienckie).
 */
export function Footer() {
  return (
    <Reveal as="footer" id="kontakt" className={styles.footer} data-stickers="">
      <StickerLayer />
      <div className={styles.main}>
        <h2 className={styles.cta}>
          <Line index={0} className={styles.l1}>
            Zróbmy
          </Line>{" "}
          <Line index={1} className={styles.l2}>
            coś razem,
          </Line>{" "}
          <Line index={2} className={styles.l3}>
            bez{" "}
            <Reveal as="span" className={styles.word}>
              <Mark className={styles.mark}>zamieszania</Mark>
            </Reveal>
          </Line>
        </h2>
        <ContactForm className={styles.form} />
      </div>
      <div className={cx("mono", styles.bottom)}>
        <address className={styles.address}>
          <CopyEmail email={site.contact.email} className={styles.link} />
        </address>
        <SocialLinks links={site.social} ariaLabel="Social" />
        <nav aria-label="Dokumenty" className={styles.legal}>
          {[termsLink, privacyLink].map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <small className={styles.copyright}>{site.copyright}</small>
      </div>
    </Reveal>
  );
}
