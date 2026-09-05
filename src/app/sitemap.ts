import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";
import { services } from "@/data/services";
import { guides } from "@/data/guides";
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

  // Bölüm sayfaları. Yollar dile göre değiştiği için (routing.ts → pathnames)
  // her dilin kendi adresi alternates içinde ayrı ayrı verilir.
  const sections: { ar: string; tr: string; en: string; priority: number }[] = [
    { ar: "/جولاتنا", tr: "/turlar", en: "/tours", priority: 0.9 },
    { ar: "/خدماتنا", tr: "/hizmetler", en: "/services", priority: 0.9 },
    { ar: "/النقل-من-المطار", tr: "/transfer", en: "/transfer", priority: 0.9 },
    { ar: "/أدلة-السفر", tr: "/seyahat-rehberi", en: "/travel-guides", priority: 0.8 },
    { ar: "/من-نحن", tr: "/hakkimizda", en: "/about", priority: 0.6 },
    { ar: "/تواصل-معنا", tr: "/iletisim", en: "/contact", priority: 0.7 },
    { ar: "/الاسئلة-الشائعة", tr: "/sikca-sorulan-sorular", en: "/faq", priority: 0.6 },
  ];

  const sectionPages: MetadataRoute.Sitemap = sections.map((section) => ({
    url: `${base}${section.ar}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: section.priority,
    alternates: {
      languages: {
        ar: `${base}${section.ar}`,
        tr: `${base}/tr${section.tr}`,
        en: `${base}/en${section.en}`,
        "x-default": `${base}${section.ar}`,
      },
    },
  }));

  const detailPages: MetadataRoute.Sitemap = [
    ...services.map((service) => ({
      ar: `/خدماتنا/${service.slug}`,
      tr: `/hizmetler/${service.slug}`,
      en: `/services/${service.slug}`,
    })),
    ...tours.map((tour) => ({
      ar: `/جولاتنا/${tour.slug}`,
      tr: `/turlar/${tour.slug}`,
      en: `/tours/${tour.slug}`,
    })),
    ...guides.map((guide) => ({
      ar: `/أدلة-السفر/${guide.slug}`,
      tr: `/seyahat-rehberi/${guide.slug}`,
      en: `/travel-guides/${guide.slug}`,
    })),
  ].map((paths) => ({
    url: `${base}${paths.ar}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        ar: `${base}${paths.ar}`,
        tr: `${base}/tr${paths.tr}`,
        en: `${base}/en${paths.en}`,
        "x-default": `${base}${paths.ar}`,
      },
    },
  }));

  return [...home, ...sectionPages, ...detailPages];
}
