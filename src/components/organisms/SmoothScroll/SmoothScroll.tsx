"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { isIntroDone, subscribeIntro } from "@/lib/intro";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { getLenis, setLenis } from "./lenis-store";

export interface SmoothScrollProps {
  children?: ReactNode;
}

/** Kotwica na tej samej stronie → element docelowy i jego `#hash`, inaczej `null`. */
function getSamePageTarget(anchor: HTMLAnchorElement): { target: HTMLElement; hash: string } | null {
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) {
    return null;
  }
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  return target ? { target, hash: url.hash } : null;
}

/**
 * Smooth scroll Lenis (npm, lerp 0.1) na całym dokumencie.
 *
 * - Wyłączony przy `prefers-reduced-motion` (natywny scroll).
 * - Zatrzymany, dopóki preloader nie skończy (jak w legacy).
 * - Respektuje `data-lenis-prevent` (natywny scroll w zagnieżdżonych kontenerach).
 * - Kotwice na tej samej stronie (`#kontakt`, `/#realizacje` na `/`) przewija płynnie
 *   (bez Lenis natywnie), przenosi na cel fokus i ustawia `#hash` w adresie.
 * - Zmiana route: skok na górę (albo do `#hash`) bez animacji; back/forward zostawia
 *   przywracanie pozycji przeglądarce.
 * - Sprząta instancję przy unmount (`destroy()`).
 *
 * Instancja dostępna przez `useLenis()`. Client Component.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const isPopNavigation = useRef(false);

  /*
   * Linki-placeholdery (`<a href="#" aria-disabled="true">`) w Server Components nie mają
   * własnego JS: bez tego klik skakał na górę strony. Działa też bez Lenis (reduced motion).
   * Rejestrowany przed listenerem kotwic (capture), więc ten widzi już `defaultPrevented`.
   */
  useEffect(() => {
    const onDisabledClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[aria-disabled='true']") : null;
      if (anchor) event.preventDefault();
    };
    window.addEventListener("click", onDisabledClick, { capture: true });
    return () => window.removeEventListener("click", onDisabledClick, { capture: true });
  }, []);

  /*
   * Kotwice na tej samej stronie (`#kontakt`, `/#kontakt` na `/`, skip link `#main`) jak
   * natywny skok: najpierw `#hash` w adresie (`pushState`, zanim cokolwiek przewinie, żeby
   * stary wpis historii zapamiętał pozycję sprzed kliknięcia i „Wstecz” do niej wracało),
   * potem przewija Lenis albo (reduced motion, bez Lenis) przeglądarka bez animacji, na koniec
   * fokus na cel (następny Tab idzie od niego). Cel bez natywnej fokusowalności dostaje
   * `tabindex="-1"` (fokus skryptem, poza kolejnością Tab).
   * `pushState` nie wywołuje natywnego skoku, `preventScroll` — drugiego przewinięcia.
   * Faza capture: działamy przed next/link, który respektuje `defaultPrevented`.
   */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      const found = getSamePageTarget(anchor);
      if (!found) return;
      const { target, hash } = found;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target);
      else target.scrollIntoView();
      if (!target.hasAttribute("tabindex") && target.tabIndex < 0) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
      stopInertiaOnNavigate: true,
    });
    if (!isIntroDone()) lenis.stop();
    const unsubscribeIntro = subscribeIntro(() => lenis.start());
    setLenis(lenis);

    /* Tylko powrót/naprzód między route'ami; sam `#hash` (klik w kotwicę) nie zmienia ścieżki. */
    const onPopState = () => {
      if (window.location.pathname !== previousPath.current) isPopNavigation.current = true;
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      unsubscribeIntro();
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  /* Synchronizacja po nawigacji Next (pomijamy pierwsze renderowanie). */
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const lenis = getLenis();
    const fromPop = isPopNavigation.current;
    isPopNavigation.current = false;
    if (!lenis || fromPop) return;

    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
    lenis.scrollTo(target ?? 0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
