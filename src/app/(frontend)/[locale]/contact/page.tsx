import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { CredentialsBand } from "@/components/site/credentials-band";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const address = [siteConfig.address.street, siteConfig.address.city]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        image="/images/chauffeur.jpg"
        imageAlt={locale === "ar" ? "سائق محترف" : "Profesyonel şoför"}
        breadcrumb={`${tNav("home")} · ${tNav("contact")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
        <div
          className="rounded-xl p-8 text-center sm:p-10"
          style={{ background: "var(--brand-night)" }}
        >
          <MessageCircle
            className="mx-auto size-8"
            style={{ color: "var(--brand-gold)" }}
            aria-hidden="true"
          />
          <h2 className="mt-4 text-[22px] font-bold text-white">{t("whatsappTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/70">
            {t("whatsappDesc")}
          </p>
          <WhatsAppLink
            className="mt-7 inline-flex items-center gap-2 rounded-md px-8 py-4 text-[15px] font-bold"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            {tCta("whatsapp")}
          </WhatsAppLink>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <Phone className="mt-0.5 size-5 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            <div>
              <div className="text-[14.5px] font-bold">{t("phoneTitle")}</div>
              <div className="mt-1 text-[14px] text-muted-foreground" dir="ltr">
                {siteConfig.phoneDisplay}
              </div>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <Mail className="mt-0.5 size-5 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            <div>
              <div className="text-[14.5px] font-bold">{t("emailTitle")}</div>
              <div className="mt-1 text-[14px] text-muted-foreground" dir="ltr">
                {siteConfig.email}
              </div>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-lg border bg-card p-6">
            <MapPin className="mt-0.5 size-5 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            <div>
              <div className="text-[14.5px] font-bold">{tNav("contact")}</div>
              <div className="mt-1 text-[14px] text-muted-foreground">{address}</div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border bg-card p-6">
            <Clock className="mt-0.5 size-5 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            <div>
              <div className="text-[14.5px] font-bold">{t("hoursTitle")}</div>
              <div className="mt-1 text-[14px] text-muted-foreground">{t("hoursValue")}</div>
            </div>
          </div>
        </div>
      </section>

      <CredentialsBand />
    </main>
  );
}
