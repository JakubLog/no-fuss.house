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

/* CSP celowo nieustawione (propozycja w README / raporcie). */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyRedirects();
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
