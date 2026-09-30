import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { CookieNotice } from "@/components/organisms/CookieNotice";
import { Cursor } from "@/components/organisms/Cursor";
import { Footer } from "@/components/organisms/Footer";
import { GridOverlay } from "@/components/organisms/GridOverlay";
import { Hud } from "@/components/organisms/Hud";
import { SmoothScroll } from "@/components/organisms/SmoothScroll";
import { site } from "@/content/site";
import { JsonLd, siteGraph } from "@/lib/seo/jsonld";
import { rootMetadata } from "@/lib/seo/metadata";
import "@/styles/tokens.css";
import "@/styles/globals.css";

/*
 * Kroje z repo (`./fonts`, licencja OFL), serwowane z naszej domeny przez next/font (preload,
 * fallback z dopasowanymi metrykami). Źródło: google/fonts, podzbiór latin + latin-ext (zakresy
 * jak w Google Fonts). TikTok Sans: osie wght 300–900 i opsz 12–36 (wdth 100, slnt 0 przypięte);
 * Geist Mono: wght 400–500.
 */
const tiktokSans = localFont({
  src: "./fonts/TikTokSans.woff2",
  weight: "300 900",
  display: "swap",
  variable: "--font-tiktok-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono.woff2",
  weight: "400 500",
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: site.colors.dark,
};

/* Bez JavaScriptu: pokazujemy treść, która normalnie czeka na reveal. */
const NO_SCRIPT_CSS = `.line>span,.fade{transform:none!important;opacity:1!important}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl" className={`${tiktokSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Przejdź do treści
        </a>
        <SmoothScroll>
          <GridOverlay />
          <Hud />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CookieNotice />
          <Cursor />
        </SmoothScroll>
        <JsonLd data={siteGraph()} />
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </body>
    </html>
  );
}
