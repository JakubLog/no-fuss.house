import { site } from "@/content/site";

/**
 * Znak do ikon (ImageResponse): kwadrat `#101318` z limonkowym kwadratem-kropką.
 * Ostre rogi (DESIGN.md), jeden akcent. Współdzielony przez icon.tsx i apple-icon.tsx.
 */
export function BrandMark({ size }: { size: number }) {
  const dot = Math.round(size * 0.28);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: site.colors.dark,
      }}
    >
      <div style={{ width: dot, height: dot, background: site.colors.accent }} />
    </div>
  );
}
