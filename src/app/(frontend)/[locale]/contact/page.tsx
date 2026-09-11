import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CalendarCheck,
  Clock,
  Languages,
  Mail,
  MapPin,
  Phone,
  PlaneLanding,
  Route,
  Timer,
  Ticket,
} from "lucide-react";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ProseSection } from "@/components/site/prose-section";
import { Band } from "@/components/site/band";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { RouteCoverage } from "@/components/site/route-coverage";
import { FaqPreview } from "@/components/site/faq-preview";
import { siteConfig, hasRealPhone, addressFull } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    /*
       Arama sonucu başlığı, sayfa etiketi DEĞİL.
       Önceki hali t("title") idi, yani H1 ile aynı: "النقل من المطار",
       "جولاتنا السياحية". İkisi ayrı iş yapıyor — H1 sayfada okunan
       etiket, <title> arama sonucunda tıklanan satır. Sonuç 31-36
       karakterlik, şehir adı bile içermeyen başlıklardı; kimse
       "havalimanı transferi" diye şehirsiz aramıyor. Rehberlerde ve
       şehir sayfalarında bu ayrım seo.title ile zaten yapılıyordu.
    */
    title: t("metaTitle"),
    description: tMeta("contact"),
    alternates: alternatesFor("/contact", locale),
  };
}

/**
 * İletişim.
 *
 * Önceki hali koyu bir WhatsApp kutusu ve altında çerçevesiz bilgi
 * satırlarıydı; sayfanın tamamı düz metindi ve tek gerçek eylem sayfanın
 * ortasında kayboluyordu. İletişim sayfası bir bilgi dökümü değil, bir
 * karar noktasıdır: ziyaretçi buraya "nasıl ulaşırım" diye gelir ve tek
 * bir yol görmelidir.
 *
 * Şimdi sol tarafta fotoğraflı ve tam boy bir WhatsApp bloğu, sağda
 * kartlaşmış bilgiler (yanıt süresi, diller, saatler, e-posta, konum).
 * Altında hangi konularda yazılabileceği — bunlar da düz maddeler değil,
 * kendi simgesi olan kartlar.
 */
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

  const details = [
    { icon: Timer, title: t("responseTitle"), value: t("responseValue") },
    { icon: Languages, title: t("languagesTitle"), value: t("languagesValue") },
    { icon: Clock, title: t("hoursTitle"), value: t("hoursValue") },
    { icon: Mail, title: t("emailTitle"), value: siteConfig.email, href: `mailto:${siteConfig.email}`, ltr: true },
    ...(hasRealPhone
      ? [{
          icon: Phone,
          title: t("phoneTitle"),
          value: siteConfig.phoneDisplay,
          href: `tel:${siteConfig.phoneHref}`,
          ltr: true,
        }]
      : []),
    /*
     * Etiket "Konum", "İletişim" değil.
     * Önceki hali nav.contact anahtarını kullanıyordu ve kart
     * "İletişim: İstanbul" diye okunuyordu; Arapçada daha kötüydü —
     * nav.contact orada "تواصل معنا" (bize ulaşın), yani kart
     * "Bize ulaşın: İstanbul" diyordu.
     */
    { icon: MapPin, title: t("locationTitle"), value: addressFull },
  ];

  const topics = [
    { icon: PlaneLanding, text: t("topic1") },
    { icon: Route, text: t("topic2") },
    { icon: Ticket, text: t("topic3") },
    { icon: CalendarCheck, text: t("topic4") },
  ];

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("contact"), url: getPathname({ locale, href: "/contact" }) },
        ]}
      />

      <PageHero
        image="/images/chauffeur.jpg"
        imageAlt={locale === "ar" ? "سائق محترف" : "Profesyonel şoför"}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("contact") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-20 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* WhatsApp — sayfanın tek gerçek eylemi, o yüzden tek büyük blok */}
          <div
            className="relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden p-8 sm:p-10"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            <Image
              src="/images/hero-ortakoy.jpg"
              alt={t("whatsappTitle")}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="absolute inset-0 z-0 object-cover object-center"
            />
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 96%, transparent) 0%, color-mix(in oklab, var(--brand-night) 84%, transparent) 42%, color-mix(in oklab, var(--brand-night) 40%, transparent) 100%)",
              }}
            />

            <div className="relative z-20">
              <span className="icon-tile mb-6 size-12" aria-hidden="true">
                <WhatsAppIcon className="size-5" />
              </span>

              <h2 className="font-display text-[28px] font-semibold leading-snug text-white sm:text-[34px]">
                {t("whatsappTitle")}
              </h2>
              <p className="mt-3.5 max-w-md text-[15px] leading-[1.8] text-white/75">
                {t("whatsappDesc")}
              </p>

              <WhatsAppLink
                className="mt-7 inline-flex items-center gap-3 rounded-[0.875rem] px-8 py-4 text-[15px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                style={{
                  background: "var(--brand-gold)",
                  color: "var(--brand-night)",
                  boxShadow: "var(--shadow-cta)",
                }}
              >
                <WhatsAppIcon className="size-5" />
                {tCta("whatsapp")}
              </WhatsAppLink>
            </div>
          </div>

          {/*
            Bilgiler — düz satır değil, her biri kendi kartı.

            Kart sayısı tek olduğunda sonuncusu iki sütuna yayılıyor.
            Telefon numarası gerçek numara girilene kadar gizli
            (hasRealPhone) ve liste beş öğede kalıyor; iki sütunlu
            ızgarada son kart tek başına düşüp yanında delik bırakıyordu.
            Numara eklendiğinde liste altıya çıkıyor ve yayılma
            kendiliğinden kapanıyor.
          */}
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, title, value, href, ltr }, index) => {
              const wide = details.length % 2 === 1 && index === details.length - 1;
              const cardClass = `reveal-rise accent-card p-5 ${wide ? "sm:col-span-2" : ""}`;
              const body = (
                <>
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-[0.875rem] ${
                      index % 2 === 1 ? "tile-sky" : ""
                    }`}
                    style={
                      index % 2 === 1
                        ? undefined
                        : {
                            background: "color-mix(in oklab, var(--brand-gold) 20%, transparent)",
                            border:
                              "1px solid color-mix(in oklab, var(--brand-gold) 42%, transparent)",
                            color: "var(--brand-gold-deep)",
                          }
                    }
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <div className="mt-4 text-[12.5px] font-bold text-muted-foreground">
                    {title}
                  </div>
                  <div
                    className="mt-1.5 text-[14.5px] font-semibold leading-snug"
                    dir={ltr ? "ltr" : undefined}
                  >
                    {value}
                  </div>
                </>
              );

              return href ? (
                <a key={title} href={href} className={`${cardClass} block`}>
                  {body}
                </a>
              ) : (
                <div key={title} className={cardClass}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hangi konularda yazabilirsiniz */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <SectionHeading title={t("topicsTitle")} rule={false} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ icon: Icon, text }, index) => (
            <WhatsAppLink key={text} subject={text} className="reveal-rise accent-card block p-6">
              <span
                className="inline-flex size-11 items-center justify-center rounded-full"
                style={{ background: "var(--brand-night)", color: "var(--brand-gold)" }}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <div
                className="mt-4 font-display text-[17px] font-semibold leading-none"
                style={{ color: "color-mix(in oklab, var(--brand-gold-deep) 70%, transparent)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="mt-2.5 text-[14px] leading-[1.7]">{text}</p>
            </WhatsAppLink>
          ))}
        </div>
      </section>

      {/*
        Mesajda ne yazılmalı.
        Site birçok yerde "aynı gün sabit fiyat" sözü veriyor ama o sözü
        tutmayı mümkün kılan bilgiyi hiçbir yerde istemiyordu: tarih, kişi
        sayısı, havalimanı, otel. Bunlar gelmediğinde ilk mesaj cevap değil
        soru oluyor ve teklif ertesi güne kayıyor. Liste bilerek gerekçeli:
        "tarih yazın" demek yerine tarihin fiyatı neden değiştirdiğini
        söylemek, listeyi doldurma oranını artırıyor.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <SectionHeading title={t("prepTitle")} subtitle={t("prepSubtitle")} rule={false} />

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((no) => (
            <li key={no} className="reveal-rise surface-card flex gap-4 p-6">
              <span className="step-badge size-9 shrink-0 text-[14px] font-extrabold">{no}</span>
              <div>
                <h3 className="text-[15.5px] font-bold leading-snug">{t(`prep${no}Title`)}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.75] text-muted-foreground">
                  {t(`prep${no}Desc`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="measure mt-6 text-[13.5px] leading-[1.8] text-muted-foreground">
          {t("prepNote")}
        </p>
      </section>

      {/*
        Yazdıktan sonrası.
        Sayfa "bize nasıl ulaşırsınız" ve "mesajınızda ne olsun" diyordu;
        mesajı yazmaktan çekinen kişinin sorusu ise başkaydı: yazarsam ne
        oluyor, fiyatı ne zaman görüyorum, sonradan üstüne bir şey eklenir
        mi. Buradaki beş adımın hepsi sitenin BAŞKA bir yerinde zaten
        verdiği sözden çıkıyor — yazılı teklif, sabit fiyat, uçuş takibi,
        şoför adı ve plakası, tek muhatap. Yeni bir taahhüt yok, dağınık
        duran sözler ilk mesajı atacak kişinin gördüğü sıraya konuldu.
      */}
      <Band>
        <ProseSection
          title={t("afterTitle")}
          body={t("afterText")}
          items={t.raw("afterItems") as { title: string; body: string }[]}
          className="pb-20"
        />

        {/*
          Kanalın kendisi.
          Sitede aranabilir bir numara yok ve arama düğmesi hiç basılmıyor;
          ziyaretçi bunu eksiklik olarak okuyabilir. Bölüm eksikliği
          savunmuyor, kanalın neden yazılı yürüdüğünü söylüyor — dördü de
          misafirin lehine olan sebepler ve dördü de doğrulanabilir.
        */}
        <ProseSection
          title={t("whyWaTitle")}
          body={t("whyWaText")}
          items={t.raw("whyWaItems") as { title: string; body: string }[]}
          className="pb-20"
        />
      </Band>

      <RouteCoverage locale={locale} variant="compact" />
      <FaqPreview />
      <PageClosing exclude={["contact"]} />
    </main>
  );
}
