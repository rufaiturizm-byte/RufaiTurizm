import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Sparkle } from "lucide-react";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FaqSchema, BreadcrumbSchema } from "@/components/site/json-ld";
import { TrustBoxes } from "@/components/site/trust-stats";
import { CredentialsBand } from "@/components/site/credentials-band";
import { ClosingCta } from "@/components/site/transfer-sections";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";

const QUESTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/faq", locale),
  };
}

/**
 * SSS sayfası.
 *
 * İki sorunu vardı. Bir: on iki soru dar bir sütunda paylaşılan sade
 * akordeonla basılıyordu; ana sayfadaki numaralı satırlarla aynı sitede
 * iki farklı soru-cevap görünümü oluşuyordu. İki: sayfa yalnızca sorulardan
 * ibaretti — cevabı listede olmayan ziyaretçinin gidecek yeri yoktu, altta
 * küçük bir düğme vardı.
 *
 * Şimdi ana sayfayla aynı satırlar, yanında fotoğraflı ve sabit duran bir
 * yardım kartı: liste boyunca kaydırırken WhatsApp hep görünürde.
 */
export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const tEyebrow = await getTranslations("eyebrow");

  const items = QUESTIONS.map((number) => ({
    question: t(`q${number}`),
    answer: t(`a${number}`),
  }));

  return (
    <main className="flex flex-1 flex-col">
      <FaqSchema items={items} />
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: t("title"), url: getPathname({ locale, href: "/faq" }) },
        ]}
      />

      <PageHero
        image="/images/kizkulesi.jpg"
        imageAlt={locale === "ar" ? "برج الفتاة في إسطنبول" : "Kız Kulesi, İstanbul"}
        breadcrumb={`${tNav("home")} · ${t("title")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-24 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("faq")}
          eyebrowIcon={<Sparkle className="size-4" aria-hidden="true" />}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <FaqAccordion items={items} />

          <aside
            className="relative isolate overflow-hidden lg:sticky lg:top-24"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            <Image
              src="/images/tours/istanbul.jpg"
              alt={t("stillTitle")}
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="absolute inset-0 z-0 object-cover object-center"
            />
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 96%, transparent) 0%, color-mix(in oklab, var(--brand-night) 90%, transparent) 34%, color-mix(in oklab, var(--brand-night) 52%, transparent) 66%, color-mix(in oklab, var(--brand-night) 14%, transparent) 100%)",
              }}
            />

            <div className="relative z-20 flex min-h-[380px] flex-col justify-end p-7">
              <h2 className="font-display text-[23px] font-semibold leading-snug text-white">
                {t("stillTitle")}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-white/72">{t("stillText")}</p>

              <WhatsAppLink
                className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
                style={{
                  background: "var(--brand-gold)",
                  color: "var(--brand-night)",
                  boxShadow: "var(--shadow-e2)",
                }}
              >
                <WhatsAppIcon className="size-[18px]" />
                {tCta("whatsapp")}
              </WhatsAppLink>
            </div>
          </aside>
        </div>
      </section>

      <ClosingCta locale={locale} />
      <CredentialsBand />
    </main>
  );
}
