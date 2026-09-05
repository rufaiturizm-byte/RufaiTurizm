import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";

const base = siteConfig.url;

/** Arapça varsayılan dil olduğu için kök adres Arapça sürümü temsil eder. */
function alternates(path = "") {
  return {
    languages: {
      ar: `${base}${path}`,
      tr: `${base}/tr${path}`,
      en: `${base}/en${path}`,
      "x-default": `${base}${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: alternates(),
    },
  ];

  // TODO: Hizmet ve tur detay sayfaları oluşturulunca aşağıdaki iki blok
  // return dizisine eklenecek. Var olmayan sayfayı sitemap'e koymak
  // Google'a 404 sunar ve tarama bütçesini boşa harcar.
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    alternates: alternates(`/${s.slug}`),
  }));

  const tourPages: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${base}/${tour.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    alternates: alternates(`/${tour.slug}`),
  }));

  void servicePages;
  void tourPages;

  return home;
}
