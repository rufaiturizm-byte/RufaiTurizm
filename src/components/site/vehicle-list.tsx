import { getTranslations } from "next-intl/server";
import { Check, Luggage, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { PhotoGallery } from "./photo-gallery";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";
import { vehicles } from "@/data/vehicles";

/**
 * Transferde kullanılan araçların listesi.
 *
 * Transfer sayfasının eksik parçasıydı: sayfa hizmeti anlatıyor ama
 * ziyaretçinin "hangi araçla geleceksiniz" sorusunu cevaplamıyordu.
 * Havalimanı transferinde bu, fiyattan sonraki en önemli soru.
 *
 * Düzen tek araca göre değil listeye göre kurulu (`src/data/vehicles.ts`):
 * ikinci araç eklendiğinde bölüm kendini tekrarlıyor, yeniden yazılmıyor.
 * Dört fotoğraf yan yana çünkü tek fotoğraf "aracın içi nasıl" sorusunu
 * bırakıyordu — dış görünüş, arka koltuk ve sürücü bölümü birlikte.
 */
export async function VehicleList() {
  const t = await getTranslations("fleet");
  const tPage = await getTranslations("transferPage");
  const tCta = await getTranslations("cta");
  const tTours = await getTranslations("tours");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("fleet")}
        title={t("listTitle")}
        subtitle={t("listSubtitle")}
        rule={false}
      />

      <div className="flex flex-col gap-6">
        {vehicles.map((vehicle) => (
          <article key={vehicle.key} className="overflow-hidden surface-card">
            {/* Fotoğraf şeridi — dört kare, tıklanınca tam boy açılıyor */}
            <PhotoGallery
              photos={vehicle.photos.map((photo) => ({
                src: photo.src,
                alt: t(photo.altKey),
              }))}
              badge={t("vitoBadge")}
            />

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="font-display text-[24px] font-semibold">{t("vito.name")}</h3>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-[14px]">
                  <span className="inline-flex items-center gap-2">
                    <Users
                      className="size-4"
                      style={{ color: "var(--brand-gold-deep)" }}
                      aria-hidden="true"
                    />
                    <strong className="font-bold tabular-nums">{vehicle.seats}</strong>{" "}
                    <span className="text-muted-foreground">{t("seats")}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Luggage
                      className="size-4"
                      style={{ color: "var(--brand-gold-deep)" }}
                      aria-hidden="true"
                    />
                    <strong className="font-bold tabular-nums">{vehicle.luggage}</strong>{" "}
                    <span className="text-muted-foreground">{t("luggageUnit")}</span>
                  </span>
                </div>

                <p className="mt-4 max-w-xl text-[14.5px] leading-[1.8] text-muted-foreground">
                  {t("vito.desc")}
                </p>

                <h4 className="mt-7 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("specTitle")}
                </h4>
                <ul className="mt-3.5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {vehicle.featureKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                      <Check
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: "var(--brand-gold-deep)" }}
                        aria-hidden="true"
                      />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="flex h-fit flex-col rounded-[var(--radius-card)] border p-6"
                style={{
                  background: "color-mix(in oklab, var(--brand-gold) 10%, transparent)",
                  borderColor: "color-mix(in oklab, var(--brand-gold) 38%, transparent)",
                }}
              >
                {vehicle.priceFrom ? (
                  <>
                    <div className="text-[12px] text-muted-foreground">{tTours("from")}</div>
                    <div
                      className="mt-1 text-[34px] font-extrabold leading-none"
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      €{vehicle.priceFrom}
                    </div>
                  </>
                ) : null}

                <p className="mt-4 text-[12.5px] leading-[1.7] text-muted-foreground">
                  {tPage("citiesSubtitle")}
                </p>

                <WhatsAppLink
                  subject={t("vito.name")}
                  className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-[0.7rem] py-3.5 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e1)" }}
                >
                  <WhatsAppIcon className="size-[18px]" />
                  {tCta("bookNow")}
                </WhatsAppLink>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-[12.5px] text-muted-foreground">{t("stockNote")}</p>
    </section>
  );
}
