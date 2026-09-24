import Image from "next/image";
import { Fade } from "@/components/atoms/Fade";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./GuideCards.module.css";

export interface Guide {
  name: string;
  /** Opis roli (mono). */
  role: string;
  /** Portret (pliki są już okrągłe z przezroczystym tłem, bez `border-radius`). */
  image: Required<CaseStudyImage>;
}

export interface GuideCardsProps {
  guides: readonly Guide[];
  className?: string;
}

/**
 * Karty przewodników AION MIND (legacy `.guides`): portret, nazwa, rola.
 * 2 kolumny, od 900 px 5. Nazwa jako `<h3>` pod `<h2>` sekcji. Server Component.
 */
export function GuideCards({ guides, className }: GuideCardsProps) {
  return (
    <Reveal className={cx(styles.guides, className)}>
      {guides.map((guide, i) => (
        <Fade key={guide.name} as="figure" index={i}>
          <Image
            className={styles.img}
            src={guide.image.src}
            alt={guide.image.alt}
            width={guide.image.width}
            height={guide.image.height}
            sizes="(max-width: 899px) 50vw, 20vw"
          />
          <figcaption>
            <h3 className={styles.name}>{guide.name}</h3>
            <span className="mono-sm">{guide.role}</span>
          </figcaption>
        </Fade>
      ))}
    </Reveal>
  );
}
