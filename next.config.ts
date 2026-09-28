import type { NextConfig } from "next";
import { routes } from "./src/content/routes";

/**
 * Przekierowania 301 ze starych adresów statycznej strony (legacy/*.html).
 * Na Vercelu działał `cleanUrls`, więc obsługujemy obie formy: `/o-nas-v5` i `/o-nas-v5.html`.
 * Lista plików pochodzi z `src/content/routes.ts` (pole `legacy`).
 */
function legacyRedirects() {
  return routes.flatMap((route) =>
    route.legacy.flatMap((file) => [
      { source: `/${file}`, destination: route.path, permanent: true },
      { source: `/${file}.html`, destination: route.path, permanent: true },
    ]),
  );
}

/*
 * Z CSP na razie tylko `frame-ancestors 'none'` (razem z `X-Frame-Options` dla starszych przeglądarek: strona
 * nie daje się osadzić w ramce, więc bez clickjackingu formularza). Pełne CSP później (propozycja w README / raporcie).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    /*
     * Jedyna Server Action to formularz kontaktu: maks. 5374 znaki (120 + 254 + 5000) po do 4 B w UTF-8, z JS
     * wysyłany jest też poprzedni stan (`invalid`/`failed` z wartościami), do tego narzut multipart: 64 kB z zapasem.
     */
    serverActions: { bodySizeLimit: "64kb" },
  },
  async redirects() {
    return legacyRedirects();
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
