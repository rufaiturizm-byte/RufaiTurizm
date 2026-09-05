import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Languages, BadgeCheck, Users, Clock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CredentialsBand } from "@/components/site/credentials-band";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tWhy = await getTranslations("whyUs");
  const tCta = await getTranslations("cta");

  const reasons = [
    { icon: Languages, key: "arabicSupport" },
    { icon: BadgeCheck, key: "fixedPrice" },
    { icon: Users, key: "family" },
    { icon: Clock, key: "support" },
  ] as const;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
        breadcrumb={`${tNav("home")} · ${tNav("about")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex max-w-3xl flex-col gap-5 text-[15.5px] leading-[1.9] text-foreground/85">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p>{t("p4")}</p>
          <p>{t("p5")}</p>
          <p>{t("p6")}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionHeading title={tWhy("title")} subtitle={t("howTitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, key }) => (
            <div key={key} className="rounded-lg border bg-card p-6">
              <Icon
                className="size-7"
                style={{ color: "var(--brand-gold-deep)" }}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-[15.5px] font-bold">{tWhy(`${key}.title`)}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {tWhy(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CredentialsBand />

      <section className="mx-auto w-full max-w-7xl px-5 py-16 text-center sm:px-8">
        <WhatsAppLink
          className="inline-flex items-center gap-2 rounded-md px-8 py-4 text-[15px] font-bold"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {tCta("whatsapp")}
        </WhatsAppLink>
      </section>
    </main>
  );
}
