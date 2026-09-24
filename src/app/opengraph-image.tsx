import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { loadGoogleFont } from "@/lib/seo/og-font";

export const alt = `${site.wordmark} — ${site.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CAPTION_TOP = site.brandTitle;
const CAPTION_BOTTOM = site.slogan.toUpperCase();

/** Domyślny obraz OG (dziedziczony przez wszystkie strony bez własnego). */
export default async function OpengraphImage() {
  const [sans, mono] = await Promise.all([
    loadGoogleFont("TikTok Sans", 700, site.wordmark),
    loadGoogleFont("Geist Mono", 400, CAPTION_TOP + CAPTION_BOTTOM),
  ]);

  const fonts = [
    ...(sans ? [{ name: "TikTok Sans", data: sans, weight: 700 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const }] : []),
  ];

  const monoStyle = { fontFamily: "Geist Mono", fontSize: 24, lineHeight: "32px", color: "#FFFFFF" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background: site.colors.dark,
        }}
      >
        <div style={monoStyle}>{CAPTION_TOP}</div>
        <div
          style={{
            fontFamily: "TikTok Sans",
            fontWeight: 700,
            fontSize: 220,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: site.colors.accent,
          }}
        >
          {site.wordmark}
        </div>
        <div style={monoStyle}>{CAPTION_BOTTOM}</div>
      </div>
    ),
    { ...size, fonts },
  );
}
