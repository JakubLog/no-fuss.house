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
 * tło ze smugami, napis 3D „no–fuss” (scena doładowana po hydratacji), h1 + zdanie „dla kogo
 * i co” + CTA kontaktu. Jeden komunikat: rola, akapity, suwak i naklejki z legacy usunięte
 * (odciążenie pierwszego ekranu), duet przedstawia `AboutSection`.
 *
 * Od 768 px układ po przekątnej: h1 w lewym górnym rogu, lead i CTA w prawym dolnym, napis 3D
 * w pasie między nimi, więc tekst nie leży na obiekcie. Server Component: tekst (w tym h1 = LCP)
 * renderuje serwer, interaktywna jest tylko scena (`HomeHeroStage`). Kontrakt: default export, bez propsów.
 */
export default function HomeHero() {
  return (
    <Reveal as="section" trigger="intro" id="hero" className={cx("tone-dark above-grid", styles.hero)}>
      <GlowBackdrop />
      <HomeHeroStage
        headline={
          <div className={styles.headline}>
            <Heading
              as="h1"
              variant="display"
              lines={["Budujemy", "produkty bez", "zamieszania"]}
              className={styles.title}
            />
            <div className={styles.aside}>
              <Fade as="p" index={3} className={styles.lead}>
                {hero.lead}
              </Fade>
              <ContactCta index={4} />
            </div>
          </div>
        }
        sceneLabel={<VisuallyHidden as="p">W tle trójwymiarowy napis no–fuss.</VisuallyHidden>}
      />
    </Reveal>
  );
}
