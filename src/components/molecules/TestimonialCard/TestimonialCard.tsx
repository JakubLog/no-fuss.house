import type { Testimonial } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./TestimonialCard.module.css";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  /**
   * Indeks staggeru cytatu; podpis dostaje `index + 2` (legacy: `--i` cytatu 0 lub 1,
   * podpisu 2 lub 3).
   */
  index?: number;
  className?: string;
}

/**
 * Treść kafla opinii (legacy `.quote`): cytat, cudzysłów w akcencie, podpis mono
 * z kwadratowym awatarem 44 px. Renderuje `<blockquote>` + `<figcaption>`, więc
 * rodzic musi być `<figure>` (w `TestimonialsSection` to `Reveal as="figure"`)
 * z klasą `cardClassName(testimonial)`. Server Component.
 */
export function TestimonialCard({ testimonial, index = 0, className }: TestimonialCardProps) {
  const { quote, author, role } = testimonial;
  return (
    <>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <blockquote className={cx("fade", styles.quote, className)} style={index ? { "--i": index } : undefined}>
        <p>{quote}</p>
      </blockquote>
      <figcaption className={cx("mono-sm", "fade", styles.caption)} style={{ "--i": index + 2 }}>
        <span className={styles.avatar} aria-hidden="true" />
        <span>
          {author}
          <small className={styles.role}>{role}</small>
        </span>
      </figcaption>
    </>
  );
}

/** Klasy kafla dla elementu `<figure>` (ciemny `tile` albo limonkowy). */
export function testimonialCardClassName(testimonial: Testimonial, className?: string): string {
  return cx(styles.card, testimonial.accent && styles.accent, className);
}
