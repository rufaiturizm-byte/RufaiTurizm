import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { routeGroups } from "@/data/routes";
import type { Locale } from "@/i18n/routing";

/**
 * Hizmet verdiğimiz noktalar.
 *
 * Sayfanın arama motorundaki tutunma yüzeyi. Önceki hali tek bir çip
 * dizisiydi ve on şehir adı taşıyordu; müşteri ise "havalimanından
 * Taksim'e transfer" diye arıyor. Semtler ve destinasyonlar gruplu
 * yazılınca hem o aramalarla eşleşiyoruz hem de ziyaretçi kendi
 * gideceği yeri listede görüyor — kapsamı iddia etmek yerine gösteriyoruz.
 *
 * Her çip WhatsApp'a gidiyor ve mesajın içine kendi adını yazıyor:
 * "Taksim" çipine dokunan kişi konuşmaya "Taksim" yazılı başlıyor.
 */
export async function RouteCoverage({
  locale,
  variant = "full",
}: {
  locale: string;
  /**
   * `full`: fotoğraflı altı kart — "nerelere gidiyorsunuz" sorusunun
   * gerçekten sorulduğu yer, yani transfer sayfaları.
   *
   * `compact`: aynı çipler tek bir şeritte, fotoğrafsız.
   *
   * Sebep ölçüldü: tam sürüm 1.642 piksel ve sekiz sayfada birebir aynı
   * basılıyordu. Hakkımızda sayfasının %49'u, turlar sayfasının %39'u
   * her sayfada tekrar eden bloklardan oluşuyordu ve en büyüğü buydu.
   * Çipler iç bağlantı değil WhatsApp bağlantısı, yani kısaltmak arama
   * motorundaki bağ yapısına dokunmuyor; yer adları da şeritte kalıyor.
   */
  variant?: "full" | "compact";
}) {
  const t = await getTranslations("routes");
  const tCta = await getTranslations("cta");
  const lang = locale as Locale;

  if (variant === "compact") {
    return (
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <div className="surface-card overflow-hidden p-7 sm:p-9">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,1fr)] lg:gap-12">
            <div className="lg:border-e lg:pe-10" style={{ borderColor: "var(--hairline)" }}>
              {/* "GÜZERGÂHLAR" etiketi kaldırıldı: başlık zaten
                  "Hizmet verdiğimiz noktalar" — etiket aynı şeyi
                  bir kez daha, büyük harfle söylüyordu. */}
              <h2 className="font-display text-[22px] font-semibold leading-snug sm:text-[26px]">
                {t("title")}
              </h2>
              <p className="measure mt-3 text-[13.5px] leading-[1.75] text-muted-foreground">
                {t("priceNote")}
              </p>
              {/*
                Çiplerin ne yaptığını söyleyen satır.

                Yuvarlak, gruplanmış çipler web'de filtre ya da sayfa
                bağlantısı demektir. Buradaki 59 çipin hepsi ise siteden
                çıkıp WhatsApp açıyor ve görünüşte bunu söyleyen hiçbir
                şey yoktu — dokunan kişi beklediğinden başka bir yere
                düşüyordu.

                Çipleri iç bağlantıya çevirmek seçenek değil: 58 yerin
                yalnız 4'ünün kendi sayfası var (transfer-routes.ts),
                kalan 54'ü 404 olurdu. O yüzden davranış aynı kaldı,
                yalnız önceden haber veriliyor.
              */}
              <p className="measure mt-3 text-[13px] leading-[1.7] text-muted-foreground/85">
                {t("stopsHint")}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {routeGroups.map((group) => {
                const title = group.title[lang] ?? group.title.tr;
                return (
                  <div key={group.key}>
                    <p
                      className="text-[10.5px] font-extrabold uppercase tracking-[0.14em]"
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      {title}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {group.stops.map((stop) => {
                        const name = stop[lang] ?? stop.tr;
                        return (
                          <li key={name}>
                            <WhatsAppLink
                              subject={`${title} — ${name}`}
                              /* Görünen yazı "Taksim"; ekran okuyucu ise
                                 hangi havalimanından olduğunu da duyuyor.
                                 Yedi yer adı iki grupta birden geçiyor. */
                              ariaLabel={t("stopAria", { group: title, stop: name })}
                              className="inline-flex items-center rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:bg-secondary"
                              style={{
                                borderColor:
                                  "color-mix(in oklab, var(--brand-night) 13%, transparent)",
                              }}
                            >
                              {name}
                            </WhatsAppLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
      />

      {/* Aynı uyarı tam sürümde de: çipler burada da WhatsApp açıyor. */}
      <p className="measure -mt-5 mb-8 text-[13px] leading-[1.7] text-muted-foreground/85">
        {t("stopsHint")}
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {routeGroups.map((group) => {
          const title = group.title[lang] ?? group.title.tr;

          return (
            <article
              key={group.key}
              className="flex flex-col overflow-hidden surface-card"
            >
              {/* Grup fotoğrafı: kartlar yalnız çiplerden oluşurken bölüm
                  bir etiket bulutu gibi duruyordu; fotoğraf her grubun
                  neresi olduğunu okumadan anlatıyor. */}
              <div className="relative aspect-[16/6] overflow-hidden">
                <Image
                  src={group.image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 90%, transparent) 0%, color-mix(in oklab, var(--brand-night) 42%, transparent) 62%, transparent 100%)",
                  }}
                />
                <div className="absolute inset-x-5 bottom-4 flex items-center gap-3">
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                  >
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-[17px] font-semibold leading-snug text-white">
                    {title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-[13px] leading-[1.7] text-muted-foreground">
                  {group.note[lang] ?? group.note.tr}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.stops.map((stop) => {
                    const name = stop[lang] ?? stop.tr;
                    return (
                      <li key={name}>
                        <WhatsAppLink
                          subject={`${title} — ${name}`}
                          ariaLabel={t("stopAria", { group: title, stop: name })}
                          className="inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-secondary"
                          style={{
                            borderColor: "color-mix(in oklab, var(--brand-night) 13%, transparent)",
                          }}
                        >
                          {name}
                        </WhatsAppLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="mt-6 flex flex-col items-start gap-4 rounded-[var(--radius-card)] border px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: "color-mix(in oklab, var(--brand-gold) 12%, transparent)",
          borderColor: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
        }}
      >
        <p className="measure text-[13.5px] leading-[1.7]">{t("priceNote")}</p>
        <WhatsAppLink
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.625rem] px-5 py-3 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {tCta("whatsapp")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </WhatsAppLink>
      </div>
    </section>
  );
}
