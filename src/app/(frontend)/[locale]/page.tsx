import { getTranslations, setRequestLocale } from "next-intl/server";
import { Car, PlaneLanding, Map, Ticket, type LucideIcon } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  WhatsAppLink,
  WhatsAppFloatingButton,
} from "@/components/site/whatsapp-cta";
import { TravelAgencySchema, WebSiteSchema } from "@/components/site/json-ld";
import { services } from "@/data/services";
import { tours } from "@/data/tours";

const icons: Record<string, LucideIcon> = {
  car: Car,
  "plane-landing": PlaneLanding,
  map: Map,
  ticket: Ticket,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const tServices = await getTranslations("services");
  const tTours = await getTranslations("tours");
  const tWhy = await getTranslations("whyUs");
  const tCta = await getTranslations("cta");

  const stats = [
    { key: "guests", value: 12000, suffix: "+" },
    { key: "years", value: 10, suffix: "+" },
    { key: "tours", value: 40, suffix: "+" },
    { key: "rating", value: 4.9, suffix: "" },
  ] as const;

  return (
    <>
      <TravelAgencySchema
        locale={locale}
        name={tBrand("name")}
        description={t("hero.subtitle")}
      />
      <WebSiteSchema name={tBrand("name")} />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
          <BlurFade delay={0.05}>
            <Badge variant="secondary" className="mb-5">
              {t("hero.eyebrow")}
            </Badge>
          </BlurFade>

          <BlurFade delay={0.12}>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              {t("hero.title")}
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </BlurFade>

          <BlurFade delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <WhatsAppLink className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105">
                {t("hero.cta")}
              </WhatsAppLink>
              <a
                href="#services"
                className="inline-flex items-center rounded-full border px-7 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </BlurFade>
        </section>

        {/* İstatistikler — sosyal kanıt */}
        <section className="border-y bg-muted/40">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 px-6 py-12 sm:grid-cols-4">
            {stats.map((s, i) => (
              <BlurFade key={s.key} delay={0.05 * i} className="text-center">
                <div className="text-3xl font-bold tabular-nums sm:text-4xl">
                  <NumberTicker
                    value={s.value}
                    decimalPlaces={s.key === "rating" ? 1 : 0}
                  />
                  {s.suffix}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {t(`stats.${s.key}`)}
                </div>
              </BlurFade>
            ))}
          </div>
        </section>

        {/* Hizmetler */}
        <section id="services" className="mx-auto w-full max-w-6xl px-6 py-20">
          <BlurFade>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              {tServices("title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              {tServices("subtitle")}
            </p>
          </BlurFade>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
              const Icon = icons[service.icon];
              return (
                <BlurFade key={service.key} delay={0.06 * i}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <Icon className="size-8 text-primary" aria-hidden="true" />
                      <h3 className="text-lg font-semibold">
                        {tServices(`${service.key}.title`)}
                      </h3>
                      <p className="flex-1 text-sm text-muted-foreground">
                        {tServices(`${service.key}.description`)}
                      </p>
                      {service.priceFrom ? (
                        <p className="text-sm font-medium">
                          {tTours("from")} {service.priceFrom} €
                        </p>
                      ) : null}
                      <WhatsAppLink
                        subject={tServices(`${service.key}.title`)}
                        className="text-sm font-medium text-[#128C7E] hover:underline"
                      >
                        {tCta("whatsapp")} ←
                      </WhatsAppLink>
                    </CardContent>
                  </Card>
                </BlurFade>
              );
            })}
          </div>
        </section>

        {/* Turlar */}
        <section id="tours" className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <BlurFade>
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {tTours("title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
                {tTours("subtitle")}
              </p>
            </BlurFade>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour, i) => (
                <BlurFade key={tour.key} delay={0.06 * i}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">
                          {tTours(`${tour.key}.name`)}
                        </h3>
                        <Badge variant="outline" className="shrink-0">
                          {tour.durationHours} saat
                        </Badge>
                      </div>
                      <p className="flex-1 text-sm text-muted-foreground">
                        {tTours(`${tour.key}.description`)}
                      </p>
                      <p className="text-sm font-medium">
                        {tTours("from")} {tour.priceFrom} €
                      </p>
                      <WhatsAppLink
                        subject={tTours(`${tour.key}.name`)}
                        className="mt-1 inline-flex w-fit items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white"
                      >
                        {tCta("bookNow")}
                      </WhatsAppLink>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Neden biz — güven unsurları */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <BlurFade>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              {tWhy("title")}
            </h2>
          </BlurFade>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {(["arabicSupport", "fixedPrice", "family", "support"] as const).map(
              (key, i) => (
                <BlurFade key={key} delay={0.06 * i}>
                  <h3 className="font-semibold">{tWhy(`${key}.title`)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tWhy(`${key}.description`)}
                  </p>
                </BlurFade>
              ),
            )}
          </div>
        </section>
      </main>

      <WhatsAppFloatingButton />
    </>
  );
}
