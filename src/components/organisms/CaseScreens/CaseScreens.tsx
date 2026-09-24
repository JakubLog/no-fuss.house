import { Fade } from "@/components/atoms/Fade";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { TileCaption } from "@/components/molecules/TileCaption";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./CaseScreens.module.css";

export interface CaseScreen {
  image: Required<CaseStudyImage>;
  caption: string;
}

export interface CaseScreensProps {
  screens: readonly CaseScreen[];
  className?: string;
}

/**
 * Siatka realnych ekranów w makietach telefonu z podpisami (legacy `.screens`):
 * 2 kolumny, od 900 px 4. Server Component.
 */
export function CaseScreens({ screens, className }: CaseScreensProps) {
  return (
    <Reveal className={cx(styles.screens, className)}>
      {screens.map((screen, i) => (
        <Fade key={screen.image.src} as="figure" index={i}>
          <PhoneFrame image={screen.image} sizes="(max-width: 899px) 50vw, 25vw" />
          <TileCaption tone="ink" className={styles.caption}>{screen.caption}</TileCaption>
        </Fade>
      ))}
    </Reveal>
  );
}
