import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ExternalLink, PlaneLanding } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, FaqSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { ProseSection } from "@/components/site/prose-section";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { origins, originBySlug, visaSourceUrl } from "@/data/origins";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return origins.map((origin) => ({ country: origin.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  const origin = originBySlug(country);
  if (!origin) return {};
  const lang = locale as Locale;

  return {
    title: origin.title[lang] ?? origin.title.tr,
    description: origin.intro[lang] ?? origin.intro.tr,
    alternates: alternatesFor({ pathname: "/from/[country]", params: { country } }, locale),
  };
}

/**
 * Misafirin geldiği ülkeye göre sayfa.
 *
 * NEDEN. Körfez misafiri "Türkiye turu" diye değil, kendi ülkesinden
 * yola çıkarak arıyor: "السفر إلى تركيا من السعودية". O sorunun cevabı
 * vize, mevsim, saat farkı ve "beni kim karşılayacak" — dördü de bu
 * sayfada, ülkeye özel.
 *
 * VİZE BİLGİSİ KAYNAĞIYLA BİRLİKTE BASILIYOR. Sayfa Dışişleri
 * Bakanlığı'nın listesine bağlantı veriyor ve kuralların değişebileceğini
 * söylüyor. Yanlış vize bilgisi bu sitede yapılabilecek en pahalı hata:
 * misafir uçağa binemezse geri dönüşü yok.
 */
export default async function OriginPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const origin = originBySlug(country);
  if (!origin) notFound();

  const lang = locale as Locale;
  const text = (value: { tr: string; ar: string; en: string }) => value[lang] ?? value.tr;

  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const t = await getTranslations("origin");

  const title = text(origin.title);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          {
            name: title,
            url: getPathname({
              locale,
              href: { pathname: "/from/[country]", params: { country } },
            }),
          },
        ]}
      />
      <FaqSchema
        items={origin.faq.map((item) => ({
          question: text(item.question),
          answer: text(item.answer),
        }))}
      />

      <PageHero
        image={origin.image}
        imageAlt={title}
        crumbs={[{ label: tNav("home"), href: "/" }, { label: title }]}
        title={title}
        subtitle={text(origin.intro)}
      />

      {/* Künye: dört doğrulanmış satır, sayfanın en üstünde. Misafirin
          uçağa binmeden önce bilmek istediği şeyler burada bitiyor. */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <dl className="grid gap-px overflow-hidden sm:grid-cols-2" style={{ background: "var(--hairline)" }}>
            {origin.facts.map((fact) => (
              <div key={fact.label.tr} className="p-5" style={{ background: "var(--background)" }}>
                <dt className="text-[12.5px] font-bold text-muted-foreground">{text(fact.label)}</dt>
                <dd className="mt-1.5 text-[15px] leading-[1.7]">{text(fact.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-col gap-12">
            {origin.sections.map((section, i) => (
              <ProseSection
                key={section.heading.tr}
                title={text(section.heading)}
                body={text(section.body)}
                index={i}
                scale="run"
              />
            ))}
          </div>

          {/* Vize kaynağı görünür bağlantı olarak: iddia bizim değil,
              bakanlığın — ve okuyucu doğrulayabilmeli. */}
          <p className="mt-10 border-s-2 ps-4 text-[13px] leading-[1.8] text-muted-foreground" style={{ borderColor: "var(--brand-gold)" }}>
            {t("visaNote")}{" "}
            <a
              href={visaSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold"
              style={{ color: "var(--brand-gold-deep)" }}
            >
              {t("visaSource")}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      <section className="section-y" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold sm:text-[34px]">{t("faqTitle")}</h2>
          <dl className="mt-6 flex flex-col divide-y" style={{ borderColor: "var(--hairline)" }}>
            {origin.faq.map((item) => (
              <div key={item.question.tr} className="py-5">
                <dt className="text-[17px] font-semibold">{text(item.question)}</dt>
                <dd className="measure mt-2 text-[14.5px] leading-[1.8] text-muted-foreground">
                  {text(item.answer)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border p-6 sm:p-8" style={{ background: "var(--background)", borderColor: "var(--hairline)" }}>
            <h2 className="font-display text-[22px] font-semibold">{t("askTitle")}</h2>
            <p className="measure mt-3 text-[14.5px] leading-[1.8] text-muted-foreground">{t("askText")}</p>
            <WhatsAppLink
              subject={title}
              className="btn-wa mt-6 inline-flex items-center gap-2.5 rounded-[0.625rem] px-6 py-3.5 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>

          {/* Bir sonraki soru: "peki orada ne yapacağım" — üç ticari sayfa. */}
          <div className="mt-10 flex flex-wrap gap-5 text-[14px] font-semibold">
            <Link href="/transfer" className="inline-flex items-center gap-2" style={{ color: "var(--brand-gold-deep)" }}>
              <PlaneLanding className="size-4" aria-hidden="true" />
              {tNav("transfer")}
            </Link>
            <Link href="/tours" className="inline-flex items-center gap-2" style={{ color: "var(--brand-gold-deep)" }}>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              {tNav("tours")}
            </Link>
            <Link href="/hotels" className="inline-flex items-center gap-2" style={{ color: "var(--brand-gold-deep)" }}>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              {tNav("hotels")}
            </Link>
          </div>
        </div>
      </section>

      <TrustBoxes />
      <PageClosing locale={locale} />
      <Band>
        <p className="text-[14.5px]">{t("bandNote")}</p>
      </Band>
    </main>
  );
}
