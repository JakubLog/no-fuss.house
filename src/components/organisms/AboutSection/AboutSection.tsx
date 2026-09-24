import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Line } from "@/components/atoms/Line";
import { PARTNERS, PartnerLogo } from "@/components/atoms/PartnerLogos";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { about } from "@/content/home";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./AboutSection.module.css";

const HEADING_ID = "o-nas-heading";
const CLIENTS_ID = "o-nas-clients";

/**
 * Sekcja `#o-nas` strony głównej (legacy `.about`): placeholder zdjęcia z podpisem,
 * statement z revealem linii, link do /o-nas i OurMoney, pasek logotypów partnerów.
 * Server Component (Reveal jest kliencki).
 */
export function AboutSection() {
  return (
    <Reveal as="section" id="o-nas" aria-labelledby={HEADING_ID} className={cx("section", styles.about)}>
      <VisuallyHidden as="h2" id={HEADING_ID}>
        {about.heading}
      </VisuallyHidden>

      <div className={cx("fade", styles.photo)}>
        {/* Placeholder 1:1 z legacy: zdjęcia jeszcze nie ma. */}
        <div className={styles.ph}>
          <span className="mono-sm">{about.photoPlaceholder}</span>
        </div>
        <svg
          className={styles.sign}
          viewBox="0 0 220 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 52c6-18 14-34 20-34s-2 30 6 30 10-22 18-22 2 22 12 22 8-20 0-22m34-16c-14 8-18 46-10 50m-8-26h22m10 4c0 14 4 22 12 22s8-18 8-22m12 0c-10 2-8 10 0 12s8 10-4 10m30-22c-10 2-8 10 0 12s8 10-4 10" />
        </svg>
      </div>

      <div className={styles.text}>
        <p className={styles.statement}>
          {about.statementLines.map((line, i) => (
            <Line key={line} index={i}>
              {line}
            </Line>
          ))}
        </p>
        <p className={cx("fade", styles.statement, styles.muted)} style={{ "--i": 4 }}>
          <ArrowLink href={about.aboutLink.href} variant="underline" arrow={null}>
            {about.aboutLink.label}
          </ArrowLink>
          . Razem budujemy{" "}
          <ArrowLink href={about.ourMoneyLink.href} variant="underline" arrow={null} external>
            {about.ourMoneyLink.label}
          </ArrowLink>{" "}
          i{" "}rozwijamy inne produkty.
        </p>
        <div className={cx("fade", styles.clients)} style={{ "--i": 5 }}>
          <span id={CLIENTS_ID} className={cx("mono-sm", styles.clientsLabel)}>
            {about.clientsLabel}
          </span>
          <ul className={styles.clientsList} aria-labelledby={CLIENTS_ID}>
            {PARTNERS.map((partner) => (
              <li key={partner.name}>
                <PartnerLogo partner={partner} className={styles.logo} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
