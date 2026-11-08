import Link from "next/link";
import type { ReactNode } from "react";
import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { Tag } from "@/components/atoms/Tag";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import type { AboutInternalLink } from "@/content/about";
import type { SocialLink } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./PersonCard.module.css";

export interface PersonCardProps {
  /** Kotwica karty; dla osób = `Person["id"]` (zgodne z `@id` Person w JSON-LD: `/o-nas#magda`). */
  id?: string;
  name: string;
  /** Zdjęcie albo placeholder (proporcje ustawia karta). */
  photo: ReactNode;
  roles: readonly string[];
  bio: string;
  /** Linki social osoby (renderowane przez `SocialLinks`). */
  social?: readonly SocialLink[];
  /** Linki wewnętrzne zamiast social (karta agentów AI). */
  internalLinks?: readonly AboutInternalLink[];
  /** `aria-label` nawigacji z linkami, np. „Social media: Magda Nestorowicz”. */
  linksLabel: string;
  /** `ai`: ciemny kadr bez kresek placeholdera, ilustracja w akcencie (`currentColor`). */
  variant?: "person" | "ai";
  className?: string;
}

/**
 * Karta postaci (legacy `.sheet`): nagłówek, zdjęcie, role, bio, linki. Obrys 1 px.
 * Linie i fade odsłania przodek z `is-in` (Reveal w organizmie). Server Component.
 */
export function PersonCard({
  id,
  name,
  photo,
  roles,
  bio,
  social,
  internalLinks,
  linksLabel,
  variant = "person",
  className,
}: PersonCardProps) {
  return (
    <article id={id} className={cx(styles.card, variant === "ai" && styles.ai, className)}>
      <Heading as="h2" variant="h2" lines={[name]} />
      <Fade className={styles.photo}>{photo}</Fade>
      <Fade as="p" index={1} className={styles.roles}>
        {roles.map((role) => (
          <Tag key={role}>{role}</Tag>
        ))}
      </Fade>
      <Fade as="p" index={2} className={styles.bio}>
        {bio}
      </Fade>
      <Fade index={3} className={cx("mono-sm", styles.links)}>
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
