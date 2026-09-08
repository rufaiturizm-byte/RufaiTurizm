import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkle } from "lucide-react";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";
import { bannersFor, type BannerPlacement } from "@/data/banners";
import type { Locale } from "@/i18n/routing";

/**
 * Kampanya bandı.
 *
 * `data/banners.ts` boşken HİÇ render edilmez — sayfada boşluk da
 * bırakmaz. Gerçek bir kampanya olmadan "özel fiyat" kartı göstermek,
 * olmayan bir indirimi varmış gibi sunmak olurdu.
 *
 * GÖRSEL DİL. Bant koyu lacivert zeminde duruyor ve sayfanın geri
 * kalanından yükselmiş görünmesi gerekiyor; o yüzden üç katman var:
 *
 *  1. Yükseklik — `--shadow-e3`, sayfadaki en yüksek kart seviyesi.
 *  2. Kenar ışığı — `--edge-light-dark`. Gerçek bir nesnenin üst kenarı
 *     ışığı yakaladığı için zemininden bir tık açıktır; koyu zeminde
 *     beyaz kenar sert kaldığı için açık zeminin değeri değil, koyu
 *     karşılığı kullanılıyor.
 *  3. Takımyıldız dokusu — düz lacivert bir dikdörtgen ucuz duruyordu.
 *
 * Altın yalnız İKİ yerde: etiket ve düğme. Üçüncü bir altın öğe eklemek
 * vurguyu dağıtıyor, bant "her yeri parlayan" bir reklam bandına dönüyor.
 */
export async function PromoBanner({
  placement,
  locale,
}: {
  placement: BannerPlacement;
  locale: string;
}) {
  const list = bannersFor(placement);
  if (list.length === 0) return null;

  const t = await getTranslations("cta");
  const lang = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <div className="flex flex-col gap-5">
        {list.map((banner) => (
          <div
            key={banner.id}
            className="relative isolate overflow-hidden pattern-constellation"
            style={{
              background: "var(--brand-night)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--edge-light-dark), var(--shadow-e3)",
            }}
          >
            {banner.image ? (
              <>
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="absolute inset-0 -z-10 object-cover object-center opacity-35"
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "linear-gradient(to right, color-mix(in oklab, var(--brand-night) 94%, transparent) 30%, color-mix(in oklab, var(--brand-night) 55%, transparent) 100%)",
                  }}
                />
              </>
            ) : null}

            <div className="flex flex-col gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]"
                  style={{
                    background: "color-mix(in oklab, var(--brand-gold) 18%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--brand-gold) 40%, transparent)",
                    color: "var(--brand-gold-label)",
                  }}
                >
                  <Sparkle className="size-3.5" aria-hidden="true" />
                  {banner.eyebrow[lang] ?? banner.eyebrow.tr}
                </span>

                <h2 className="mt-4 max-w-2xl font-display text-[24px] font-semibold leading-snug text-white sm:text-[30px]">
                  {banner.title[lang] ?? banner.title.tr}
                </h2>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-white/72">
                  {banner.description[lang] ?? banner.description.tr}
                </p>

                {banner.terms ? (
                  /* Şartlar ayrı ve küçük: kampanyanın neyi kapsadığı
                     başlıkta değil burada durmalı, yoksa başlık vaat
                     ettiğinden fazlasını söylüyormuş gibi okunuyor. */
                  <p
                    className="mt-4 inline-block rounded-[0.6rem] px-3 py-2 text-[12.5px] font-semibold"
                    style={{
                      background: "color-mix(in oklab, white 8%, transparent)",
                      color: "rgb(255 255 255 / 0.82)",
                    }}
                  >
                    {banner.terms[lang] ?? banner.terms.tr}
                  </p>
                ) : null}
              </div>

              <WhatsAppLink
                subject={banner.title[lang] ?? banner.title.tr}
                className="cta-gold inline-flex w-fit shrink-0 items-center gap-2.5 rounded-[0.8rem] px-7 py-4 text-[14.5px] font-bold"
              >
                <WhatsAppIcon className="size-[18px]" />
                {banner.cta ? (banner.cta[lang] ?? banner.cta.tr) : t("whatsapp")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
