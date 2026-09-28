"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Logo } from "@/components/atoms/Logo";
import { NavList } from "@/components/molecules/NavList";
import { mainNav } from "@/content/navigation";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgress } from "./ScrollProgress";
import styles from "./Hud.module.css";

/** Od tej szerokości linki stoją w wierszu HUD, a przycisku menu nie ma (jak `@media` w Hud.module.css). */
const WIDE_QUERY = "(min-width: 768px)";

/**
 * HUD: logo + nawigacja u góry, postęp scrolla przy prawej krawędzi. Biały w
 * `mix-blend-mode: difference`, więc sam odwraca się nad każdą sekcją.
 * Client Component (pathname, stan menu).
 *
 * Poniżej 768 px zamiast linków jest przycisk „Menu” (dwie kreski → krzyżyk), który rozwija
 * pełnoekranowy `MobileMenu` (disclosure: `aria-expanded` + `aria-controls`). Panel leży pod
 * HUD, więc logo i przycisk zostają na wierzchu. Menu zamyka: przycisk, Escape (fokus wraca
 * na przycisk), klik w link, zmiana ścieżki (także Wstecz), przejście na ≥ 768 px i fokus
 * poza HUD i panelem (nic nie zostaje pod zasłoną). Bez JS przycisku nie ma, linki zawijają się w HUD.
 */
export function Hud() {
  const pathname = usePathname();
  const wide = useMediaQuery(WIDE_QUERY);
  const [open, setOpen] = useState(false);
  /** Ścieżka, na której menu otwarto: inna ścieżka = nawigacja, menu się zamyka. */
  const [openedAt, setOpenedAt] = useState(pathname);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Stan poprawiany w renderze (bez efektu i bez klatki z otwartym menu na nowej stronie). */
  if (open && (wide || pathname !== openedAt)) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    /* Tab za ostatni link, skip link, skok do kotwicy: fokus wychodzi spod panelu, więc menu znika. */
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (headerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((value) => !value);
  };

  /* Logo na `/` nie zmienia ścieżki, więc klik w link HUD zamyka menu wprost. */
  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a[href]")) setOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={styles.hud}
        data-lenis-prevent={open ? "" : undefined}
        onClick={closeOnLink}
      >
        <div className={styles.row}>
          <Logo />
          <NavList items={mainNav} pathname={pathname} ariaLabel="Główna" className={styles.nav} />
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={toggle}
          >
            Menu
            <span className={styles.icon} aria-hidden="true" />
          </button>
        </div>
        <ScrollProgress className={styles.progress} thumbClassName={styles.thumb} />
      </header>
      <MobileMenu
        ref={menuRef}
        id={menuId}
        open={open}
        items={mainNav}
        pathname={pathname}
        onNavigate={() => setOpen(false)}
      />
    </>
  );
}
