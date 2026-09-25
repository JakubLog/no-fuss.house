"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/atoms/Logo";
import { NavList } from "@/components/molecules/NavList";
import { mainNav } from "@/content/navigation";
import { ScrollProgress } from "./ScrollProgress";
import styles from "./Hud.module.css";

/**
 * HUD: logo + nawigacja u góry, postęp scrolla przy prawej krawędzi. Biały w
 * `mix-blend-mode: difference`, więc sam odwraca się nad każdą sekcją.
 * Client Component (pathname).
 *
 * Poniżej 768 px nawigacja przechodzi na mono 12 px z odstępem 8 px (4 linki
 * mieszczą się od ~340 px, węższe zawijają; „Wiedza” znika poniżej 640 px).
 */
export function Hud() {
  const pathname = usePathname();

  return (
    <header className={styles.hud}>
      <div className={styles.row}>
        <Logo />
        <NavList items={mainNav} pathname={pathname} ariaLabel="Główna" className={styles.nav} />
      </div>
      <ScrollProgress className={styles.progress} thumbClassName={styles.thumb} />
    </header>
  );
}
