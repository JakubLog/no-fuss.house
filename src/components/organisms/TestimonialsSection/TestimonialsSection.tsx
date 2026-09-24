import { TestimonialCard, testimonialCardClassName } from "@/components/molecules/TestimonialCard";
import { publishedTestimonials, testimonialsSection } from "@/content/home";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./TestimonialsSection.module.css";

const HEADING_ID = "opinie-heading";

/**
 * Sekcja `#opinie` (legacy `.quotes`, `tone-dark`): kafle opinii w układzie
 * 7 + 5, trzeci z offsetem (od 900 px). Każdy kafel to `<figure>` z Reveal.
 * Renderuje tylko opinie bez placeholderów (`publishedTestimonials`); bez żadnej
 * prawdziwej opinii zwraca `null` (placeholdery nie trafiają na produkcję).
 * Server Component.
 */
export function TestimonialsSection() {
  const items = publishedTestimonials();
  if (items.length === 0) return null;

  return (
    <section id="opinie" aria-labelledby={HEADING_ID} className="section tone-dark">
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={HEADING_ID} className={cx("fade", styles.label)}>
          {testimonialsSection.label}
        </h2>
        <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
          01–{String(items.length).padStart(2, "0")}
        </span>
      </Reveal>
      <div className={styles.grid}>
        {items.map((item) => (
          <Reveal as="figure" key={item.quote} className={testimonialCardClassName(item)}>
            {/* Legacy: limonkowy (drugi) kafel ma stagger przesunięty o 1. */}
            <TestimonialCard testimonial={item} index={item.accent ? 1 : 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
