import Image from "next/image";
import { Fade } from "@/components/atoms/Fade";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./CaseStage.module.css";

type StageImage = Required<CaseStudyImage>;

interface CaseStageBase {
  className?: string;
}

export interface CaseStagePhonesProps extends CaseStageBase {
  /** Limonkowa scena z ekranami w makietach telefonu (legacy `.stage`). */
  variant: "phones";
  images: readonly StageImage[];
}

export interface CaseStageImageProps extends CaseStageBase {
  /** Jedna grafika na pełną szerokość (legacy `.stage.stage--img`). */
  variant: "image";
  image: StageImage;
  /** `sizes` dla `next/image`. Domyślnie `100vw`. */
  sizes?: string;
  /**
   * `standalone` (domyślnie): własny `Reveal` (pasek pod hero).
   * `inline`: `.fade` wewnątrz sekcji, która już ma `Reveal`.
   */
  placement?: "standalone" | "inline";
  /** Indeks staggeru przy `placement="inline"`. */
  index?: number;
}

export type CaseStageProps = CaseStagePhonesProps | CaseStageImageProps;

/**
 * Limonkowa scena pod hero case study: trzy telefony wystające poza dolną krawędź
 * albo jedna grafika. Server Component (reveal przez klienckie `Reveal`).
 */
export function CaseStage(props: CaseStageProps) {
  if (props.variant === "phones") {
    return (
      <Reveal className={cx(styles.stage, styles.phones, props.className)}>
        {props.images.map((image, i) => (
          <Fade key={`${image.src}-${i}`} as="figure" index={i} className={styles.phone}>
            <PhoneFrame image={image} sizes="(max-width: 960px) 33vw, 300px" />
          </Fade>
        ))}
      </Reveal>
    );
  }

  const { image, sizes = "100vw", placement = "standalone", index } = props;
  const picture = (
    <Image
      className={styles.img}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
    />
  );

  if (placement === "inline") {
    return (
      <Fade index={index} className={cx(styles.stage, styles.image, props.className)}>
        {picture}
      </Fade>
    );
  }

  return (
    <Reveal className={cx(styles.stage, styles.image, props.className)}>
      <Fade>{picture}</Fade>
    </Reveal>
  );
}
