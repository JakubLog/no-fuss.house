import type { Metadata, Viewport } from "next";
import { Geist_Mono, TikTok_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Cursor } from "@/components/organisms/Cursor";
import { Footer } from "@/components/organisms/Footer";
import { GridOverlay } from "@/components/organisms/GridOverlay";
import { Hud } from "@/components/organisms/Hud";
import { Preloader } from "@/components/organisms/Preloader";
import { SmoothScroll } from "@/components/organisms/SmoothScroll";
import { site } from "@/content/site";
import { JsonLd, siteGraph } from "@/lib/seo/jsonld";
import { rootMetadata } from "@/lib/seo/metadata";
import "@/styles/tokens.css";
import "@/styles/globals.css";

/* Kroje self-hostowane przez next/font (bez zapytań do Google w przeglądarce). */
const tiktokSans = TikTok_Sans({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-tiktok-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: site.colors.dark,
};

/*
 * Bez JavaScriptu: chowamy preloader, zdejmujemy blokadę scrolla
 * i pokazujemy treść, która normalnie czeka na reveal.
 */
const NO_SCRIPT_CSS = `
[data-preloader]{display:none!important}
body:has([data-preloader="active"]){overflow:visible;overflow-x:hidden}
.line>span,.fade{transform:none!important;opacity:1!important}
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl" className={`${tiktokSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Przejdź do treści
        </a>
        <SmoothScroll>
          <Preloader />
          <GridOverlay />
          <Hud />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
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
