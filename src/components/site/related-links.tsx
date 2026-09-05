import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Sayfa sonu iç bağlantı bloğu.
 *
 * Denetimde çıktı: sayfa başına ortalama 3 TEKİL iç bağlantı vardı ve üç
 * sayfada (SSS, hakkımızda, oteller) gövde içinde hiç iç bağlantı yoktu —
 * o sayfalardaki tek çıkış üst menü ve altbilgiydi. Arama motoru sayfalar
 * arası ilişkiyi menüden değil gövdedeki bağlantılardan okur; ziyaretçi de
 * okuduğu şeyin devamını orada arar.
 *
 * Bulunduğu sayfa listeden düşürülüyor: kendine link veren bir "ilgili
 * sayfalar" bloğu hem gereksiz hem kafa karıştırıcı.
 */
type Key = "transfer" | "tours" | "services" | "hotels" | "guides" | "faq" | "about" | "contact";

const HREFS = {
  transfer: "/transfer",
  tours: "/tours",
  services: "/services",
  hotels: "/hotels",
  guides: "/guides",
  faq: "/faq",
  about: "/about",
  contact: "/contact",
} as const;

export async function RelatedLinks({
  exclude = [],
  only,
}: {
  /** Bulunduğumuz sayfa — kendine link vermemek için. */
  exclude?: Key[];
  /** Verilirse yalnız bunlar gösterilir; sırası da korunur. */
  only?: Key[];
}) {
  const t = await getTranslations("related");

  const keys = (only ?? (Object.keys(HREFS) as Key[])).filter(
    (key) => !exclude.includes(key),
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <div
        className="rounded-[var(--radius-card)] border px-6 py-8 sm:px-9"
        style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}
      >
        <h2 className="font-display text-[22px] font-semibold sm:text-[26px]">{t("title")}</h2>
        <p className="mt-2 text-[14px] text-muted-foreground">{t("subtitle")}</p>

        <ul className="mt-7 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {keys.map((key) => (
            <li key={key}>
              <Link
                href={HREFS[key]}
                className="group flex items-center justify-between gap-3 border-b py-3.5 text-[14.5px] font-semibold transition-colors hover:text-[color:var(--brand-gold-deep)]"
                style={{ borderColor: "var(--hairline)" }}
              >
                {t(key)}
                <ArrowRight
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
