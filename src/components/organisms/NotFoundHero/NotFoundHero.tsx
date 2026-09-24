import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
import { Reveal } from "@/components/organisms/Reveal";
import { cx } from "@/lib/cx";
import { NotFoundStage } from "./NotFoundStage";
import styles from "./NotFoundHero.module.css";

/**
 * Hero strony 404 1:1 z legacy/404.html: napis 3D „404” startuje z zamieszaniem 100%,
 * litery uciekają przed kursorem, „Posprzątaj ↓” układa cyfry i podmienia tekst.
 * Link „Wróć na stronę główną →” jest widoczny od początku (audyt UX), „Posprzątaj” obok jako ghost.
 * Server Component (interakcja w `NotFoundStage`).
 */
export function NotFoundHero() {
  return (
    <Reveal as="section" trigger="intro" id="hero" className={cx("tone-dark above-grid", styles.hero)} data-stickers="">
      <GlowBackdrop />
      <NotFoundStage />
    </Reveal>
  );
}
