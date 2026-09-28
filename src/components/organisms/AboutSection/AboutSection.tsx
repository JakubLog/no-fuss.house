import { Fragment } from "react";
import Image from "next/image";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Line } from "@/components/atoms/Line";
import { PARTNERS, PartnerLogo } from "@/components/atoms/PartnerLogos";
import { PhotoPlaceholder } from "@/components/atoms/PhotoPlaceholder";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { personCards } from "@/content/about";
import { about } from "@/content/home";
import { people } from "@/content/site";
import { cx } from "@/lib/cx";
import { MarqueeLoop } from "../Marquee";
import { Reveal } from "../Reveal";
import styles from "./AboutSection.module.css";

const HEADING_ID = "o-nas-heading";
const CLIENTS_ID = "o-nas-clients";

/** Szerokość jednego portretu (pół kolumny zdjęć): kolumny 1–3 od 1024 px, 1–4 od 640 px, niżej maks. 340 px. */
const PHOTO_SIZES = "(min-width: 1024px) 13vw, (min-width: 640px) 17vw, 170px";

/**
 * Sekcja `#o-nas` strony głównej (legacy `.about`): po lewej portrety Magdy i Kuby obok siebie
 * (3:4, `personCards[id].photo`, te same co na `/o-nas`; bez zdjęcia placeholder z imieniem) z podpisem
 * „kto co robi” pod każdym (z `people`), po prawej statement z revealem linii,
 * link do /o-nas i OurMoney, logotypy partnerów w pętli (`MarqueeLoop`). Server Component (Reveal jest kliencki).
 */
export function AboutSection() {
  return (
    <Reveal as="section" id="o-nas" aria-labelledby={HEADING_ID} className={cx("section", styles.about)}>
      <VisuallyHidden as="h2" id={HEADING_ID}>
        {about.heading}
      </VisuallyHidden>

      <figure className={styles.photo}>
        <div className={styles.pair}>
          {people.map((person) => {
            const photo = personCards[person.id].photo;
            return photo ? (
              <Image
                key={person.id}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={PHOTO_SIZES}
                className={styles.img}
                style={{ objectPosition: photo.focus }}
              />
            ) : (
              <PhotoPlaceholder key={person.id} label={person.givenName} className={styles.img} />
            );
          })}
        </div>
        <figcaption>
          <ul className={cx("mono-sm", styles.people)}>
            {people.map((person) => (
              <li key={person.id}>
                {person.name}&nbsp;— {person.role}
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>

      <div className={styles.text}>
        <p className={styles.statement}>
          {about.statementLines.map((line, i) => (
            <Fragment key={line}>
              {i > 0 ? " " : null}
              <Line index={i}>{line}</Line>
            </Fragment>
          ))}
        </p>
        <p className={cx(styles.statement, styles.muted)}>
          <ArrowLink href={about.aboutLink.href} variant="underline" arrow={null}>
            {about.aboutLink.label}
          </ArrowLink>
          . Razem budujemy{" "}
          <ArrowLink href={about.ourMoneyLink.href} variant="underline" arrow={null} external>
            {about.ourMoneyLink.label}
          </ArrowLink>{" "}
          i&nbsp;rozwijamy inne produkty.
        </p>
        <div className={styles.clients}>
          <span id={CLIENTS_ID} className={cx("mono-sm", styles.clientsLabel)}>
            {about.clientsLabel}
          </span>
          <MarqueeLoop className={styles.clientsMarquee}>
            <ul className={styles.clientsList} aria-labelledby={CLIENTS_ID}>
              {PARTNERS.map((partner) => (
                <li key={partner.name}>
                  <PartnerLogo partner={partner} className={styles.logo} />
                </li>
              ))}
            </ul>
          </MarqueeLoop>
        </div>
      </div>
    </Reveal>
  );
}
