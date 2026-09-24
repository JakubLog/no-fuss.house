import { Fade } from "@/components/atoms/Fade";
import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
import { Heading } from "@/components/atoms/Heading";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { ContactCta } from "@/components/molecules/ContactCta";
import { Reveal } from "@/components/organisms/Reveal";
import { hero } from "@/content/home";
import { cx } from "@/lib/cx";
import { HomeHeroStage } from "./HomeHeroStage";
import styles from "./HomeHero.module.css";

/**
 * Hero strony głównej (legacy/no-fuss-v5.html, `section.hero#hero`) pod klientów usługowych:
 * tło ze smugami, napis 3D „no–fuss” (scena doładowana po hydratacji), naklejki,
 * h1 + zdanie „dla kogo i co” + CTA kontaktu, rola + dwa akapity, suwak „Zamieszanie”.
 *
 * Kolejność DOM (i na telefonie wizualna): h1, lead, CTA → rola i akapity → suwak.
 * Server Component: tekst (w tym h1 = LCP) renderuje serwer, interaktywne są tylko
 * scena i suwak (`HomeHeroStage`). Kontrakt: default export, bez propsów.
 */
export default function HomeHero() {
  return (
    <Reveal as="section" trigger="intro" id="hero" className={cx("tone-dark above-grid", styles.hero)} data-stickers="">
      <GlowBackdrop />
      <HomeHeroStage
        top={
          <div className={styles.top}>
            {/* Legacy: `h2` przed `h1`. Tu `p` (ten sam wygląd), żeby h1 był pierwszym nagłówkiem. */}
            <p className={cx(styles.role, "fade")} style={{ "--i": 5 }}>
              Design &amp;
              <br />
              Development
            </p>
            <Fade as="p" index={6}>
              Myślimy systemami. Projektujemy z&nbsp;troską.
            </Fade>
            <Fade as="p" index={7}>
              {hero.duo}
            </Fade>
          </div>
        }
        headline={
          <div className={styles.headline}>
            <Heading as="h1" variant="display" lines={["Budujemy", "produkty bez", "zamieszania"]} />
            <Fade as="p" index={3} className={styles.lead}>
              {hero.lead}
            </Fade>
            <ContactCta index={4} className={styles.cta} />
          </div>
        }
        sceneLabel={<VisuallyHidden as="p">W tle trójwymiarowy napis no–fuss.</VisuallyHidden>}
        sceneClassName={styles.scene}
      />
    </Reveal>
  );
}
