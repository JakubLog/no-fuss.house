import type { MetadataRoute } from "next";
import { routes } from "@/content/routes";
import { absoluteUrl } from "@/lib/seo/site-url";

/** Sitemap z `src/content/routes.ts` (jedno źródło prawdy). */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
