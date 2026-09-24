import { cx } from "@/lib/cx";
import styles from "./GlowBackdrop.module.css";

export interface GlowBackdropProps {
  /** Np. do zmiany `z-index` w hero (legacy: -2 w hero, 0 w stopce). */
  className?: string;
}

/**
 * Ciemne tło `--hero-sky` z czterema rozmytymi smugami limonki (legacy `.hero__bg`).
 * Hero i stopka. Rodzic musi mieć `position: relative; overflow: hidden`. Server Component.
 */
export function GlowBackdrop({ className }: GlowBackdropProps) {
  return (
    <div className={cx(styles.backdrop, className)} data-glow="" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
