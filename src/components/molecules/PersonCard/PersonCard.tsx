import Link from "next/link";
import type { ReactNode } from "react";
import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { Tag } from "@/components/atoms/Tag";
import { FactRow } from "@/components/molecules/FactRow";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import type { AboutFact, AboutFactValue, AboutInternalLink } from "@/content/about";
import type { SocialLink } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./PersonCard.module.css";

export interface PersonCardProps {
  /** Kotwica karty; dla osób = `Person["id"]` (zgodne z `@id` Person w JSON-LD: `/o-nas#magda`). */
  id?: string;
  name: string;
  /** Chip w nagłówku: „P1”, „P2”, „P3”. */
  code: string;
  /** Zdjęcie albo placeholder (proporcje ustawia karta). */
  photo: ReactNode;
  roles: readonly string[];
  bio: string;
  facts: readonly AboutFact[];
  /** Linki social osoby (renderowane przez `SocialLinks`). */
  social?: readonly SocialLink[];
  /** Linki wewnętrzne zamiast social (karta agentów AI). */
  internalLinks?: readonly AboutInternalLink[];
  /** `aria-label` nawigacji z linkami, np. „Social media: Magda Nestorowicz”. */
  linksLabel: string;
  /** `ai`: limonkowe tło zdjęcia (legacy `.sheet--ai`). */
  variant?: "person" | "ai";
  className?: string;
}

function FactValue({ value }: { value: AboutFactValue }) {
  switch (value.kind) {
    case "text":
      return value.text;
    case "links":
      return value.links.map((link, i) => (
        <span key={link.href}>
          {i > 0 && ", "}
          <Link href={link.href}>{link.label}</Link>
        </span>
      ));
    case "meter":
      return (
        <span className={styles.meter}>
          <i aria-hidden="true" style={{ "--v": value.value }} />
          {value.label}
        </span>
      );
  }
}

/**
 * Karta postaci (legacy `.sheet`): nagłówek z chipem, zdjęcie, role, bio,
 * lista `dl` w mono ze wskaźnikiem „Zamieszanie 0%”, linki. Obrys 1 px.
 * Linie i fade odsłania przodek z `is-in` (Reveal w organizmie). Server Component.
 */
export function PersonCard({
  id,
  name,
  code,
  photo,
  roles,
  bio,
  facts,
  social,
  internalLinks,
  linksLabel,
  variant = "person",
  className,
}: PersonCardProps) {
  return (
    <article id={id} className={cx(styles.card, variant === "ai" && styles.ai, className)}>
      <div className={styles.head}>
        <Heading as="h2" variant="h2" lines={[name]} />
        <Tag>{code}</Tag>
      </div>
      <Fade className={styles.photo}>{photo}</Fade>
      <Fade as="p" index={1} className={styles.roles}>
        {roles.map((role) => (
          <Tag key={role}>{role}</Tag>
        ))}
      </Fade>
      <Fade as="p" index={2} className={styles.bio}>
        {bio}
      </Fade>
      <Fade as="dl" index={3} className={cx("mono", styles.facts)}>
        {facts.map((fact) => (
          <FactRow key={fact.term} term={fact.term} className={styles.fact}>
            <FactValue value={fact.value} />
          </FactRow>
        ))}
      </Fade>
      <Fade index={4} className={cx("mono-sm", styles.links)}>
        {social ? (
          <SocialLinks links={social} ariaLabel={linksLabel} />
        ) : (
          <nav aria-label={linksLabel}>
            {internalLinks?.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Fade>
    </article>
  );
}
