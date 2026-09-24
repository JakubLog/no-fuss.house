"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Wysokość toru i uchwytu (px), 1:1 z legacy. */
const TRACK = 200;
const THUMB = 28;

/** Pasek postępu scrolla przy prawej krawędzi (desktop). */
export function ScrollProgress({ className, thumbClassName }: { className?: string; thumbClassName?: string }) {
  const thumbRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      thumb.style.transform = `translateY(${p * (TRACK - THUMB)}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div className={className} aria-hidden="true">
      <i ref={thumbRef} className={thumbClassName} />
    </div>
  );
}
