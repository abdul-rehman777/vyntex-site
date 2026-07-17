import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { serviceSlugs, industriesByLang } from "@/lib/marketing-content";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/industries", "/about", "/partners", "/partners/apply", "/contact", "/privacy", "/terms", "/cookies", "/accessibility"];
  return [
    ...routes.map((route) => ({ url: `${SITE.url}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...serviceSlugs.map((slug) => ({ url: `${SITE.url}/services/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...industriesByLang.en.map((industry) => ({ url: `${SITE.url}/industries#${industry.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
