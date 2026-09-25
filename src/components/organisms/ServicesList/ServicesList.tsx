import { ContactCta } from "@/components/molecules/ContactCta";
import { servicesSection } from "@/content/home";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./ServicesList.module.css";

const HEADING_ID = "uslugi-heading";

/**
 * Sekcja `#uslugi` (legacy `.services`): nagłówek mono (jedyny reveal w sekcji) i lista pięciu
 * usług w `<ul>` (nazwa w roli `title`, opis `--muted`), widoczna od razu. Bez numerów z legacy:
 * kolejność usług nic nie znaczy (`no` zostaje tylko jako id w JSON-LD). Wiersze nie są linkami; hover
 * (tylko CSS, `hover: hover`) jak w FAQ: limonkowe tło i wcięcie 12 px. Pod listą CTA kontaktu
 * (`ContactCta`). Server Component.
 */
export function ServicesList() {
  return (
    <section id="uslugi" aria-labelledby={HEADING_ID} className="section">
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={HEADING_ID} className={cx("fade", styles.label)}>
          {servicesSection.label}
        </h2>
      </Reveal>
      <ul className={styles.list}>
        {servicesSection.items.map((service) => (
          <li key={service.no} className={styles.item}>
            <h3 className={styles.name}>{service.name}</h3>
            <p className={styles.desc}>{service.description}</p>
          </li>
        ))}
      </ul>
      <div className={styles.cta}>
        <ContactCta note />
      </div>
    </section>
  );
}
