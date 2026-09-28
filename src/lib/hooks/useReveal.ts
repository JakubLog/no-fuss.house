"use client";

import { useEffect, useState, type RefObject } from "react";
import { useIntroDone } from "./useIntroDone";
import { useReducedMotion } from "./useReducedMotion";

/**
 * - `view`: odsłonięcie przy wejściu w viewport (IntersectionObserver, raz).
 * - `intro`: odsłonięcie na starcie wejścia (hero; fonty gotowe, `@/lib/intro`). Przy nawigacji client-side,
 *   gdy intro już było, odsłania od razu po krótkim opóźnieniu.
 */
export type RevealTrigger = "view" | "intro";

export interface UseRevealOptions {
  trigger?: RevealTrigger;
}

/** Opóźnienie reveal hero po starcie wejścia (legacy: 250 ms po ruszeniu kurtyny). */
export const INTRO_REVEAL_DELAY_MS = 250;

/** Parametry obserwatora 1:1 z legacy. */
const OBSERVER_INIT: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -8% 0px",
};

/* Jeden współdzielony obserwator dla wszystkich elementów [data-reveal]. */
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const callback = callbacks.get(entry.target);
      sharedObserver?.unobserve(entry.target);
      callbacks.delete(entry.target);
      callback?.();
    }
  }, OBSERVER_INIT);
  return sharedObserver;
}

/** Cel obserwacji: ref albo sam element (np. z callback ref trzymanego w state). */
export type RevealTarget<T extends Element> = RefObject<T | null> | T | null;

function resolveTarget<T extends Element>(target: RevealTarget<T>): T | null {
  if (target === null) return null;
  return "current" in target ? target.current : target;
}

/**
 * Zwraca `true`, gdy element powinien dostać klasę `is-in`.
 * Stagger linii (80 ms) robi CSS przez zmienną `--i` na `.line` / `.fade`.
 */
export function useReveal<T extends Element>(
  target: RevealTarget<T>,
  { trigger = "view" }: UseRevealOptions = {},
): boolean {
  const [isIn, setIsIn] = useState(false);
  const introDone = useIntroDone();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isIn) return;

    if (trigger === "intro") {
      if (!introDone) return;
      const timer = window.setTimeout(() => setIsIn(true), reduced ? 0 : INTRO_REVEAL_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    const element = resolveTarget(target);
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setIsIn(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = getObserver();
    callbacks.set(element, () => setIsIn(true));
    observer.observe(element);
    return () => {
      observer.unobserve(element);
      callbacks.delete(element);
    };
  }, [isIn, trigger, introDone, reduced, target]);

  return isIn;
}
