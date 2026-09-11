import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { PageClosing } from "@/components/site/page-closing";
import { AssuranceBand } from "@/components/site/assurance-band";
import { WhatsAppIcon } from "@/components/site/icons";
import { TravelAgencySchema, WebSiteSchema } from "@/components/site/json-ld";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustStats } from "@/components/site/trust-stats";
import { SectionHeading, SectionAction } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { PromoBanner } from "@/components/site/promo-banner";
import { PackagesSection } from "@/components/site/packages-section";
import { Reviews } from "@/components/site/reviews";
import { ServicesOverview } from "@/components/site/services-overview";
import { WhyUs } from "@/components/site/why-us";
import { VipBand } from "@/components/site/vip-band";
import { DestinationsMarquee } from "@/components/site/destinations-marquee";
import { FaqPreview } from "@/components/site/faq-preview";
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
  const tHome2 = await getTranslations("home2");
  const tCta = await getTranslations("cta");
  const tToursPage = await getTranslations("toursPage");

  const featured = tours.slice(0, 4);

  return (
    <>
      <TravelAgencySchema name={tBrand("name")} description={t("hero.subtitle")} />
      <WebSiteSchema name={tBrand("name")} />

      <main id="main" className="flex flex-1 flex-col">
        {/*
          Hero.

          Gradyan yatay: fotoğraftaki Ortaköy Camii ve Boğaz sağ tarafta
          açıkta kalıyor, metin solda kendi koyu zeminini buluyor. Dikey
          gradyanda başlık fotoğrafın en kalabalık yerine denk geliyordu.

          Başlık iki renkte: ilk satır beyaz, ikinci satır altın. Tek renkli
          hâli 64 piksellik bir blok olarak okunuyordu; kırılma hem cümleyi
          hem markayı ayırıyor.
        */}
        <section className="relative isolate">
          <Image
            src="/images/hero-ortakoy.jpg"
            alt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
            fill
            priority
            sizes="100vw"
          quality={60}
            className="ken-burns -z-10 object-cover object-center"
          />
          <div
            className="absolute inset-0 -z-10 scrim-x"
          />
          {/* Alt kenarda ikinci bir koyu geçiş: transfer formu buraya biniyor
              ve fotoğrafın parlak kısmı kartın gölgesini yutuyordu. */}
          <div className="scrim-bottom absolute inset-x-0 bottom-0 -z-10 h-48" />

          <div className="mx-auto max-w-7xl px-5 pt-20 pb-32 sm:px-8 sm:pt-28 sm:pb-40">
            <div
              className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-sm"
              style={{
                borderColor: "color-mix(in oklab, var(--brand-gold) 55%, transparent)",
                background: "color-mix(in oklab, var(--brand-night) 45%, transparent)",
              }}
            >
              <ShieldCheck className="size-4" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
              <AnimatedShinyText className="text-[12px] font-semibold tracking-[0.12em] text-white/85">
                TÜRSAB{siteConfig.credentials.tursab ? ` • ${siteConfig.credentials.tursab}` : ""}
              </AnimatedShinyText>
            </div>

            <h1 className="mt-8 max-w-3xl font-display text-[42px] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[68px]">
              {t("hero.titleLead")}
              <br />
              <span style={{ color: "var(--brand-gold)" }}>{t("hero.titleAccent")}</span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-[1.8] text-white/80">
              {t("hero.subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <WhatsAppLink
                className="inline-flex items-center gap-3 rounded-[0.875rem] px-7 py-4 text-[15px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--brand-gold) 88%, white) 0%, var(--brand-gold) 55%, color-mix(in oklab, var(--brand-gold) 84%, var(--brand-gold-deep)) 100%)",
                  color: "var(--brand-night)",
                  boxShadow: "var(--shadow-cta)",
                }}
              >
                <WhatsAppIcon className="size-[19px]" />
                {tCta("whatsapp")}
              </WhatsAppLink>

              <Link
                href="/tours"
                className="inline-flex items-center gap-2.5 rounded-[0.875rem] border px-7 py-4 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                style={{ borderColor: "color-mix(in oklab, white 38%, transparent)" }}
              >
                {tHome2("allToursCta")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            {/* Kaydırma ipucu — formun üstüne binen kartın hemen üstünde */}
            <div
              className="scroll-hint mt-14 hidden w-fit items-center gap-2.5 text-[12.5px] font-semibold text-white/70 lg:flex"
              aria-hidden="true"
            >
              <ChevronDown className="size-4" />
              {tHome2("scrollHint")}
            </div>
          </div>
        </section>

        {/* Transfer talep formu — hero'nun üstüne biner, seçimler WhatsApp mesajına dönüşür */}
        <section className="relative z-10 mx-auto -mt-24 w-full max-w-7xl px-5 sm:px-8">
          <TransferForm />
        </section>

        <TrustStats />

        <ServicesOverview />

        {/* Çok tercih edilen turlar — krem zemin, iki beyaz bölüm arasında ayrım */}
        <section className="section-band" style={{ background: "var(--brand-sand)" }}>
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
            <SectionHeading
              title={tHome2("popularTours")}
              subtitle={tToursPage("subtitle")}
              rule={false}
              action={
                <Link href="/tours">
                  <SectionAction>
                    {tHome2("allToursCta")}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </SectionAction>
                </Link>
              }
            />

            <div className="card-rail grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((tour) => (
                <TourCard key={tour.key} tour={tour} />
              ))}
            </div>
          </div>
        </section>

        <PackagesSection locale={locale} />

        <PromoBanner placement="home" locale={locale} />

        {/* Şehir şeridi geri kondu: bölüm sayısını azaltırken çıkarılmıştı
            ama "Neden biz"in hemen üstündeki bu bant sayfanın ritmini
            kuruyor — iki koyu bandın arasına giren tek yatay hareket o. */}
        <DestinationsMarquee />

        <WhyUs />

        <div className="pt-24">
          <VipBand locale={locale} />
        </div>

        {/*
          DÖRT BÖLÜM BURADAN KALDIRILDI.

          Ana sayfa on üç bölümdü: masaüstünde 15, mobilde 23,6 ekran.
          Bölüm yığmak sayfayı "dolu" değil KARARSIZ gösteriyor —
          hangisinin önemli olduğuna karar verilmediği için hepsi
          arka arkaya dizilmişti. Ziyaretçinin sonuna kadar indiği bir
          sayfa değil bu; ilk üç ekranda karar verip WhatsApp'a geçtiği
          bir sayfa. Geri kalanı yalnızca aradaki mesafeyi uzatıyordu.

          Çıkanların HEPSİNİN kendi sayfası var ve dördü de üst menüde:
            DestinationsMarquee → Bölgeler
            RouteCards          → Transfer (on üç güzergâhın tamamı orada)
            VehicleList         → Transfer (filo bölümü)
            GuidesTeaser        → Seyahat Rehberi

          Yani içerik silinmedi, ait olduğu yere bırakıldı. Ana sayfada
          kalanlar tek bir soruyu sırayla cevaplıyor: kimsiniz (güven),
          ne yapıyorsunuz (hizmetler, turlar, paketler), fiyat nasıl
          belirleniyor (bant), neden siz (neden biz, VIP), söz veriyor
          musunuz (güvence), aklımdaki soru (SSS), başkaları ne demiş
          (yorumlar).
        */}
        <AssuranceBand />

        <FaqPreview />
        <Reviews />
      <PageClosing locale={locale} />
      </main>
    </>
  );
}
