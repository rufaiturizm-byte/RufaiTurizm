import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Tours } from "./src/collections/Tours";
import { Services } from "./src/collections/Services";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — Rufai Turizm" },
  },
  collections: [Tours, Services, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "src/payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
  }),
  // Site üç dilli; ana pazar Arapça olduğu için varsayılan o.
  localization: {
    locales: [
      { label: "العربية", code: "ar" },
      { label: "Türkçe", code: "tr" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  sharp: undefined,
})
