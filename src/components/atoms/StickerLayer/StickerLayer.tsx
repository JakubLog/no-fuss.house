import { cx } from "@/lib/cx";
import styles from "./StickerLayer.module.css";

export interface StickerLayerProps {
  className?: string;
}

/** Atrybut strefy, w której kursor zostawia naklejki (hero, stopka). */
export const STICKER_ZONE_ATTR = "data-stickers";
/** Atrybut warstwy, do której Cursor dokleja naklejki. */
export const STICKER_LAYER_ATTR = "data-sticker-layer";

/** Klasa pojedynczej naklejki (używana przez organizm Cursor). */
export const stickerClassName: string = styles.sticker;

/**
 * Pusta warstwa na naklejki spod kursora. Wstaw ją do elementu z atrybutem
 * `data-stickers` (strefa). Naklejki dokleja organizm Cursor. Server Component.
 *
 * ```tsx
 * <section data-stickers>
 *   <StickerLayer />
 *   …
 * </section>
 * ```
 */
export function StickerLayer({ className }: StickerLayerProps) {
  return <div className={cx(styles.layer, className)} data-sticker-layer="" aria-hidden="true" />;
}
