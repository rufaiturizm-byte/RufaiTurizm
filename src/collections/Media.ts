import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 480, height: 320, position: "centre" },
      { name: "card", width: 900, height: 600, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      label: "Alternatif metin (SEO ve erişilebilirlik için)",
    },
  ],
};
