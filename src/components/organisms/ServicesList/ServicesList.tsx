import { Line } from "@/components/atoms/Line";
import { ContactCta } from "@/components/molecules/ContactCta";
import { servicesSection } from "@/content/home";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./ServicesList.module.css";

const HEADING_ID = "uslugi-heading";

/**
 * Sekcja `#uslugi` (legacy `.services`): nagłówek mono z licznikiem i lista pięciu
 * usług w `<ol>` (numer mono, nazwa w roli `title`, opis `--muted`). Każdy wiersz
 * odsłania się osobno. Pod listą CTA kontaktu (`ContactCta`). Server Component.
 */
export function ServicesList() {
  return (
    <section id="uslugi" aria-labelledby={HEADING_ID} className="section">
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={HEADING_ID} className={cx("fade", styles.label)}>
          {servicesSection.label}
        </h2>
        <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
          {servicesSection.counter}
        </span>
      </Reveal>
      <ol className={styles.list}>
        {servicesSection.items.map((service) => (
          <Reveal as="li" key={service.no} className={styles.item}>
            <span className={cx("mono", "fade", styles.no)} aria-hidden="true">
              {service.no}
            </span>
            <h3 className={styles.name}>
              <Line>{service.name}</Line>
            </h3>
            <p className={cx("fade", styles.desc)} style={{ "--i": 2 }}>
              {service.description}
            </p>
          </Reveal>
        ))}
      </ol>
      <Reveal className={styles.cta}>
        <ContactCta index={0} note />
      </Reveal>
    </section>
  );
}
