import Image from "next/image";
import type { ReactNode } from "react";
import type { CaseStudyImage } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./PhoneFrame.module.css";

interface PhoneFrameBase {
  className?: string;
}

export interface PhoneFrameImageProps extends PhoneFrameBase {
  /** Zrzut ekranu (bez ramki). `width`/`height` wymagane dla `next/image`. */
  image: Required<CaseStudyImage>;
  /** `sizes` dla `next/image` (szerokość ramki w layoucie). */
  sizes: string;
  children?: undefined;
}

export interface PhoneFrameContentProps extends PhoneFrameBase {
  image?: undefined;
  sizes?: undefined;
  /** Własny ekran w HTML (np. odtworzony Dziennik AION MIND). */
  children: ReactNode;
}

export type PhoneFrameProps = PhoneFrameImageProps | PhoneFrameContentProps;

/**
 * Makieta iPhone'a (legacy `.device.iph`): ciemny korpus, dynamic island, przycisk boczny.
 * Zaokrąglenia korpusu i ekranu to ilustracja sprzętu, nie UI strony.
 * Server Component.
 */
export function PhoneFrame(props: PhoneFrameProps) {
  return (
    <div className={cx(styles.frame, props.className)}>
      {props.image ? (
        <Image
          className={styles.screen}
          src={props.image.src}
          alt={props.image.alt}
          width={props.image.width}
          height={props.image.height}
          sizes={props.sizes}
        />
      ) : (
        props.children
      )}
    </div>
  );
}
