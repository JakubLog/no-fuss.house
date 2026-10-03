import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
import { Reveal } from "@/components/organisms/Reveal";
import { cx } from "@/lib/cx";
import { NotFoundStage } from "./NotFoundStage";
import styles from "./NotFoundHero.module.css";

/**
 * Hero strony 404 1:1 z legacy/404.html: napis 3D „404” startuje z zamieszaniem 100%,
 * litery uciekają przed kursorem, pierwsze przewinięcie (> 24 px) układa cyfry i podmienia tekst.
 * Jedyny przycisk to „Wróć na stronę główną →”, obok zachęta do przewinięcia do `#mordor`.
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
