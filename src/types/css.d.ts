import "react";

/**
 * Pozwala przekazywać custom properties w `style` bez rzutowania,
 * np. `style={{ "--i": 2 }}` (stagger reveal) albo `style={{ "--s": "96px" }}`.
 */
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
