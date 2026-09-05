import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Hizmet", plural: "Hizmetler" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "priceFrom", "published"] },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true, localized: true, label: "Hizmet adı" },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "excerpt", type: "textarea", localized: true, label: "Kısa açıklama" },
    { name: "description", type: "richText", localized: true, label: "Detaylı açıklama" },
    { name: "image", type: "upload", relationTo: "media", label: "Görsel" },
    { name: "priceFrom", type: "number", label: "Başlangıç fiyatı (boş bırakılırsa gösterilmez)" },
    { name: "currency", type: "select", defaultValue: "EUR", options: ["EUR", "USD", "TRY"] },
    {
      name: "features",
      type: "array",
      localized: true,
      label: "Neler dahil",
      fields: [{ name: "item", type: "text", required: true }],
    },
    { name: "order", type: "number", defaultValue: 0, label: "Sıralama" },
    { name: "published", type: "checkbox", defaultValue: false, label: "Yayında" },
  ],
};
