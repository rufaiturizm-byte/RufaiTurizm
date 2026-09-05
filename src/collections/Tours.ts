import type { CollectionConfig } from "payload";

export const Tours: CollectionConfig = {
  slug: "tours",
  labels: { singular: "Tur", plural: "Turlar" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "priceFrom", "published"] },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true, localized: true, label: "Tur adı" },
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "URL'de görünür, örn: istanbul-turu" } },
    { name: "excerpt", type: "textarea", localized: true, label: "Kısa açıklama (kartlarda görünür)" },
    { name: "description", type: "richText", localized: true, label: "Detaylı açıklama" },
    { name: "image", type: "upload", relationTo: "media", label: "Kapak görseli" },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true, label: "Galeri" },
    { name: "priceFrom", type: "number", required: true, label: "Başlangıç fiyatı (kişi başı)" },
    { name: "currency", type: "select", defaultValue: "EUR", options: ["EUR", "USD", "TRY"], label: "Para birimi" },
    { name: "durationHours", type: "number", label: "Süre (saat)" },
    {
      name: "highlights",
      type: "array",
      localized: true,
      label: "Öne çıkan yerler",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "note", type: "text" },
      ],
    },
    {
      name: "itinerary",
      type: "array",
      localized: true,
      label: "Gün programı",
      fields: [
        { name: "time", type: "text", required: true, admin: { description: "örn: 09:00" } },
        { name: "title", type: "text", required: true },
        { name: "detail", type: "textarea" },
      ],
    },
    { name: "published", type: "checkbox", defaultValue: false, label: "Yayında" },
  ],
};
