import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { Reveal } from "@/components/organisms/Reveal";
import { aboutHero } from "@/content/about";
import styles from "./TeamHero.module.css";

/**
 * Hero `/o-nas` (legacy `.team-hero` z o-nas-v5): nagłówek display w trzech liniach
 * i lead w kroju statement. Odsłania się po preloaderze. Server Component.
 */
export function TeamHero() {
  return (
    <Reveal as="section" trigger="intro" id="hero" className={`above-grid ${styles.hero}`}>
      <Heading as="h1" variant="display" lines={aboutHero.lines} className={styles.title} />
      <Fade as="p" index={aboutHero.lines.length} className={styles.lead}>
        {aboutHero.lead}
      </Fade>
    </Reveal>
  );
}
