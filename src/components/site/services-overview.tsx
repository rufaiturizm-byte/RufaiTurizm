import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Car,
  Map,
  MessageCircle,
  PhoneCall,
  PlaneLanding,
  Ticket,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { services } from "@/data/services";

/**
 * Ana sayfadaki hizmet özeti.
 *
 * Ana sayfa hizmetlerden hiç söz etmiyordu: menüde "Hizmetlerimiz" yazıyor
 * ama ana sayfaya inen ziyaretçi transferi, turu ve rezervasyonu hiç
 * görmeden aşağı kayıyordu. Kartlar kısa tutuldu; ayrıntı hizmet sayfasında.
 *
 * Fotoğrafın alt kenarına binen yuvarlak simge referanstan: dört fotoğraf
 * yan yana gelince hangisinin hangi hizmet olduğu okumadan anlaşılmıyordu,
 * simge o ayrımı bir bakışta veriyor.
 */

/*
 * Simgeler artık services.ts icindeki `icon` alanindan geliyor.
 *
 * Iki ayri tanim vardi: veri dosyasi car / plane-landing / map / ticket
 * diyordu, bilesen ise kendi listesini tutuyordu ve veri alani hic
 * okunmuyordu. Bilesenin sectikleri anlamca da zayifti — rehberli tur
 * hizmeti icin FOTOGRAF MAKINESI, ucak bileti ve otel rezervasyonu icin
 * BINA simgesi cikiyordu. Tek kaynak veri dosyasi; simge degistirmek
 * icin artik bilesene dokunmak gerekmiyor.
 */
const ICONS = {
  car: Car,
  "plane-landing": PlaneLanding,
  map: Map,
  ticket: Ticket,
} as const;

export async function ServicesOverview() {
  const t = await getTranslations("services");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tPage = await getTranslations("servicesPage");
  const tHome2 = await getTranslations("home2");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-24 pb-16 sm:px-8">
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
        action={
          <Link href="/services">
            <SectionAction>
              {tPage("allServices")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </SectionAction>
          </Link>
        }
      />

      <div className="card-rail grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const name = t(`${service.key}.title`);
          const Icon = ICONS[service.icon];
          const href = {
            pathname: "/services/[slug]" as const,
            params: { slug: service.slug },
          };

          return (
            <div key={service.key} className="reveal-rise flex">
              <article className="group flex w-full flex-col overflow-hidden surface-card surface-card-lift">
                <div className="relative">
                  <Link href={href} className="relative block aspect-[16/11] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <span
                    className="absolute -bottom-6 start-5 inline-flex size-12 items-center justify-center rounded-full"
                    style={{
                      background: "var(--brand-night)",
                      color: "var(--brand-gold)",
                      boxShadow: "var(--shadow-e2)",
                    }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pt-10 pb-5">
                  <h3 className="font-display text-[18px] font-semibold leading-snug">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {name}
                    </Link>
                  </h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                    {t(`${service.key}.description`)}
                  </p>

                  <div
                    className="mt-5 flex items-end justify-between gap-3 border-t pt-4"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <div>
                      {service.priceFrom ? (
                        <>
                          <div className="text-[17px] font-extrabold leading-none">
                            €{service.priceFrom}
                          </div>
                          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">
                            {t("priceFrom")}
                          </div>
                        </>
                      ) : (
                        <div className="max-w-[92px] text-[13px] font-bold leading-tight">
                          {tCommon("priceOnRequest")}
                        </div>
                      )}
                    </div>

                    <WhatsAppLink
                      subject={name}
                      className="btn-wa inline-flex shrink-0 items-center gap-2 rounded-[0.625rem] px-3.5 py-2.5 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    >
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      {tCta("bookNow")}
                    </WhatsAppLink>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* Fiyatı olmayan hizmet için tek çıkış yolu: kişiye özel teklif. */}
      <div
        className="mt-8 flex flex-col items-start gap-5 rounded-[var(--radius-card)] border px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--hairline)",
          boxShadow: "var(--shadow-panel-flat)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            <PhoneCall className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display text-[17px] font-semibold">{tHome2("quoteTitle")}</div>
            <p className="mt-1 text-[13.5px] text-muted-foreground">{tHome2("quoteText")}</p>
          </div>
        </div>

        {/*
          İKİNCİL — bilerek çerçeveli, dolgulu değil.

          Bu bant dört hizmet kartının ALTINDA duruyor ve kartların her
          birinde zaten altın dolgu bir düğme var. Bu da dolgu olunca tek
          ekranda beş altın düğme oluyordu; altın her yerde olunca vurgu
          olmaktan çıkıyor ve göz nereye gideceğini bilemiyor.

          Hiyerarşi aslında belli: kartlardaki düğmeler ana yol (aradığı
          hizmeti bulan oradan gider), bu bant ise BULAMAYAN için bir
          çıkış. İkincil bir yolu birincil gibi çizmek yanlış bilgi.
        */}
        <WhatsAppLink
          subject={tHome2("quoteTitle")}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.625rem] border px-6 py-3.5 text-[14px] font-bold transition-colors hover:bg-[color-mix(in_oklab,var(--brand-night)_5%,transparent)]"
          style={{
            borderColor: "color-mix(in oklab, var(--brand-night) 22%, transparent)",
            color: "var(--brand-night)",
          }}
        >
          {tHome2("quoteCta")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </WhatsAppLink>
      </div>
    </section>
  );
}
