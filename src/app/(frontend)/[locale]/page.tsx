import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Star, Building2, ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { TravelAgencySchema, WebSiteSchema } from "@/components/site/json-ld";
import { tours } from "@/data/tours";
import { siteConfig } from "@/config/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const tTours = await getTranslations("tours");
  const tStats = await getTranslations("stats");
  const tHome2 = await getTranslations("home2");
  const tCta = await getTranslations("cta");

  const stats = [
    { icon: Users, value: "+12.000", label: tStats("guestsLabel") },
    { icon: Star, value: "4.9 / 5", label: tStats("ratingLabel") },
    { icon: Building2, value: "2015", label: tStats("sinceLabel") },
    { icon: ShieldCheck, value: "TÜRSAB", label: tStats("licenseLabel") },
  ];

  const featured = tours.slice(0, 4);

  return (
    <>
      <TravelAgencySchema locale={locale} name={tBrand("name")} description={t("hero.subtitle")} />
      <WebSiteSchema name={tBrand("name")} />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate">
          <Image
            src="/images/hero-ortakoy.jpg"
            alt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 92%, transparent) 0%, color-mix(in oklab, var(--brand-night) 55%, transparent) 42%, color-mix(in oklab, var(--brand-night) 18%, transparent) 100%)",
            }}
          />

          <div className="mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
            <div
              className="inline-flex items-center gap-2.5 border px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-white"
              style={{ borderColor: "color-mix(in oklab, var(--brand-gold) 60%, transparent)" }}
            >
              <ShieldCheck className="size-4" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
              TÜRSAB · {siteConfig.credentials.tursab || "[lisans no]"}
            </div>

            <h1 className="mt-7 max-w-2xl text-[40px] font-bold leading-[1.22] text-white sm:text-[56px]">
              {t("hero.title")}
            </h1>

            <p className="mt-5 max-w-lg text-[17px] leading-[1.8] text-white/80">
              {t("hero.subtitle")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <WhatsAppLink
                className="inline-flex items-center gap-2.5 rounded-md px-7 py-4 text-[15px] font-bold transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
              >
                <MessageCircle className="size-[19px]" aria-hidden="true" />
                {tCta("whatsapp")}
              </WhatsAppLink>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-md border border-white/35 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {tHome2("allToursCta")}
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* İstatistik şeridi */}
        <section className="border-b bg-background">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3.5">
                <Icon className="size-7 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
                <div>
                  <div className="text-[22px] font-bold leading-tight">{value}</div>
                  <div className="text-[13px] text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Çok tercih edilen turlar */}
        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-[28px] font-bold sm:text-[32px]">{tHome2("popularTours")}</h2>
            <Link
              href="/tours"
              className="inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
            >
              {tHome2("allToursCta")}
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tour) => (
              <Link
                key={tour.key}
                href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
                className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/images/tours/${tour.key}.jpg`}
                    alt={tTours(`${tour.key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                    <span className="rounded bg-white/92 px-2.5 py-1 text-[11.5px] font-semibold">
                      {tour.durationHours} {locale === "ar" ? "ساعة" : locale === "tr" ? "Saat" : "h"}
                    </span>
                    <span
                      className="rounded px-2.5 py-1 text-[11.5px] font-bold"
                      style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                    >
                      €{tour.priceFrom}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[15.5px] font-bold uppercase tracking-wide">
                    {tTours(`${tour.key}.name`)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {tTours(`${tour.key}.description`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* VIP transfer bandı */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <div className="relative isolate overflow-hidden rounded-xl">
            <Image
              src="/images/vito-black.jpg"
              alt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="-z-10 object-cover object-center"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to inline-end, color-mix(in oklab, var(--brand-night) 94%, transparent) 0%, color-mix(in oklab, var(--brand-night) 72%, transparent) 55%, transparent 100%)",
              }}
            />
            <div className="max-w-xl px-8 py-16 sm:px-12 sm:py-20">
              <h2 className="text-[27px] font-bold leading-snug text-white sm:text-[32px]">
                {tHome2("vipTitle")}
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.8] text-white/78">{tHome2("vipText")}</p>
              <WhatsAppLink
                subject={tHome2("vipTitle")}
                className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[14.5px] font-bold"
                style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
              >
                {tCta("whatsapp")}
              </WhatsAppLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
