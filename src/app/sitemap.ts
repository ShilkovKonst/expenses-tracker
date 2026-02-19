import { BASE_URL } from "@/constants";
import { MetadataRoute } from "next";

const locales = ["en", "fr", "ru"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [""];

  const entries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((page) => {
      const url = `${BASE_URL}/${locale}${page}/`;
      return {
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${BASE_URL}/${alt}${page}/`])
          ),
        },
      };
    })
  );
  return entries;
}
