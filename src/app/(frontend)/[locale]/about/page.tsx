import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ProseSection } from "@/components/site/prose-section";
import { TrustStats } from "@/components/site/trust-stats";
import {
  BadgeCheck,
  Building2,
  CarFront,
  CloudRain,
  HeartPulse,
  Hotel,
  MessageSquareWarning,
  Scale,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "about" });

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
    description: tMeta("about"),
    alternates: alternatesFor("/about", locale),
  };
}

/**
 * Hakkımızda.
 *
 * Önceki hali altı paragrafı tek sütunda alt alta diziyordu: sayfanın
 * tamamı, üst banttan sonra, kesintisiz bir metin duvarıydı. "Hakkımızda"
 * sayfası güven sayfasıdır ve güven metinle değil, kanıtla kurulur —
 * rakamlar, belge, araç, hizmet verilen yerler.
 *
 * Şimdi metin ikiye bölünmüş (kimiz / misafirlerimize sözümüz), her biri
 * kendi fotoğrafıyla; aralarında istatistik şeridi, belge bandı ve kapsam
 * listesi var. Aynı metin, okunabilir hale gelmiş bir sayfada.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tFleet = await getTranslations("fleet");

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("about"), url: getPathname({ locale, href: "/about" }) },
        ]}
      />

      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("about") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <TrustStats />

      {/* Kimiz — metin solda, fotoğraf sağda */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-24 pb-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              title={t("storyTitle")}
              rule={false}
            />
            <div className="measure flex flex-col gap-5 text-[15.5px] leading-[1.9] text-foreground/85">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>

          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            {/*
              Stok şoför fotoğrafı yerine kendi ofisimiz. "Hakkımızda"
              sayfasının işi şirketin gerçek olduğunu göstermek; tabelası,
              vitrini ve oturma alanıyla bir ofis fotoğrafı bunu stok bir
              portreden çok daha iyi yapıyor. Dikey kadraj 4/5 alana tam
              oturuyor, kırpma gerekmiyor.
            */}
            <Image
              src="/images/office.jpg"
              alt={tFleet("officeAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Sözümüz — fotoğraf solda, metin sağda */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div
            className="relative aspect-[4/3] overflow-hidden lg:order-1"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            <Image
              src="/images/fleet/vito-interior.jpg"
              alt={tFleet("interiorAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover"
            />
          </div>

          <div className="lg:order-2">
            <SectionHeading
              title={t("promiseTitle")}
              rule={false}
            />
            <div className="measure flex flex-col gap-5 text-[15.5px] leading-[1.9] text-foreground/85">
              <p>{t("p4")}</p>
              <p>{t("p5")}</p>
              <p>{t("p6")}</p>
            </div>
          </div>
        </div>
      </section>

      {/*
        Doğrulanabilir kanıt.
        
        Sayfanın geri kalanı "nasıl çalışırız" anlatıyordu — hepsi doğru ama
        hepsi bizim ağzımızdan. Körfez'den gelen misafirin asıl sorusu başka:
        bu şirket gerçek mi? Buradaki dört maddenin dördü de ziyaretçinin
        kendi kontrol edebileceği şeyler; TÜRSAB kaydı doğrudan resmî
        listeye bağlı.

        Dördüncü madde bilerek olumsuz. "Herkese uygun değiliz" demek
        müşteri kaybettirir gibi görünür ama tersini yapan her siteye
        benzemekten çıkarır — ve yanlış beklentiyle gelen misafir zaten
        memnun ayrılmıyor.
      */}
      <section
        className="section-band border-y"
        style={{ background: "var(--brand-sand)", borderColor: "var(--hairline)" }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeading
            eyebrow={t("proofEyebrow")}
            title={t("proofTitle")}
            subtitle={t("proofSubtitle")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {(
              [
                { icon: Building2, title: t("proof1Title"), desc: t("proof1Desc") },
                { icon: CarFront, title: t("proof2Title"), desc: t("proof2Desc") },
                {
                  icon: BadgeCheck,
                  title: t("proof3Title"),
                  desc: t("proof3Desc"),
                  href: siteConfig.tursabVerifyUrl,
                  cta: t("verifyCta"),
                },
                { icon: Scale, title: t("proof4Title"), desc: t("proof4Desc") },
              ] as const
            ).map(({ icon: Icon, title, desc, ...rest }) => {
              const href = "href" in rest ? rest.href : undefined;
              const cta = "cta" in rest ? rest.cta : undefined;

              return (
                <div key={title} className="reveal-rise accent-card flex flex-col p-7">
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-[0.875rem]"
                    style={{
                      background: "color-mix(in oklab, var(--brand-gold) 20%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--brand-gold) 42%, transparent)",
                      color: "var(--brand-gold-deep)",
                    }}
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-[16px] font-bold leading-snug">{title}</h3>
                  <p className="mt-2.5 flex-1 text-[14px] leading-[1.85] text-foreground/80">
                    {desc}
                  </p>

                  {href && cta ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-fit items-center rounded-full border px-4 py-2 text-[12.5px] font-bold transition-colors hover:bg-secondary"
                      style={{
                        borderColor: "color-mix(in oklab, var(--brand-gold-deep) 46%, transparent)",
                        color: "var(--brand-gold-deep)",
                      }}
                    >
                      {cta}
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/*
        Belgenin kendisi.
        Kanıt kartlarından biri "TÜRSAB kaydı doğrulanabilir" diyor ve
        resmî arama sayfasına bağlanıyor — ama oraya tıklayan misafir boş
        bir arama kutusu görüyor ve ne yazacağını bilmiyor. Bölüm o adımı
        yazıyor: hangi kutuya ne girilir, kayıt hangi adla açılır.

        İkinci sebep, kaydın kendisinde çıkan ve sitede hiç geçmeyen bir
        şey: rufaiturizm.com bu belgenin altında "doğrulanmış web sitesi"
        olarak duruyor. Yani bu SAYFA ile belge arasındaki bağı TÜRSAB
        kuruyor. Körfez'den bakan biri için elimizdeki en güçlü kanıt bu
        ve söylenmiyordu.

        Son paragraf bilerek belgenin sınırını söylüyor: belge hizmet
        kalitesini garanti etmiyor. Sayfanın "herkese uygun değiliz"
        maddesiyle aynı mantık — kanıtı olduğundan büyük göstermek,
        kanıtın kendisini de şüpheli yapıyor.
      */}
      <Band>
        <ProseSection title={t("licenceTitle")} body={t("licenceText")} className="pt-20" />

        {/*
          Aksilik bölümü, kanıtların hemen ardında.
          Sitede müşteri kaynaklı iptal koşulları vardı (tur için 24 saat,
          uçak bileti için havayolu kuralları) ama "biz hata yaparsak ya da
          hayat araya girerse ne oluyor" hiçbir yerde yazmıyordu. Güven
          sayfasının en çok merak edilen ama en az yazılan kısmı bu.

          Buradaki her madde sitenin BAŞKA bir yerde zaten verdiği sözden
          çıkıyor — uçuş takibi, kendi filosu, otel rezervasyonunun bizim
          adımıza yapılması, turların özel olması. Yeni bir taahhüt
          eklenmedi. Para tarafı bilerek dışarıda: iade ve iptal koşulları
          hizmete ve tarihe göre değişiyor, buraya genel bir cümle yazmak
          tutulamayacak bir söz olurdu.
        */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
          <SectionHeading
            eyebrow={t("wrongEyebrow")}
            title={t("wrongTitle")}
            subtitle={t("wrongSubtitle")}
            rule={false}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CloudRain, n: 1 },
              { icon: Wrench, n: 2 },
              { icon: Hotel, n: 3 },
              { icon: HeartPulse, n: 4 },
              { icon: MessageSquareWarning, n: 5 },
            ].map(({ icon: Icon, n }) => (
              <article key={n} className="reveal-rise surface-card p-6">
                <span className="icon-tile inline-flex size-11 items-center justify-center">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold leading-snug">{t(`wrong${n}Title`)}</h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.8] text-muted-foreground">
                  {t(`wrong${n}Desc`)}
                </p>
              </article>
            ))}
          </div>

          <p className="measure mt-6 text-[13.5px] leading-[1.8] text-muted-foreground">
            {t("wrongNote")}
          </p>
        </section>

        {/*
          Kapanış blokları en sonda.
          Önceki sırada "Keşfetmeye devam edin" ve belge bandı sayfanın
          ortasında çıkıyor, ardından dört bölüm daha geliyordu: ziyaretçi
          sayfanın bittiğini sanıp okumayı bırakabiliyordu. Sitedeki
          on dört sayfanın tamamı ClosingCta -> RelatedLinks ->
          CredentialsBand ile bitiyor; hakkımızda tek istisnaydı.
        */}

        <div className="pt-24">
        </div>
      </Band>

      <PageClosing locale={locale} exclude={["about"]} />
    </main>
  );
}
