import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Banknote, Headphones, MessagesSquare, Users } from "lucide-react";

/**
 * "Neden biz" — koyu zeminli üç kolon.
 *
 * Önceden dört eş kartlık bir ızgaraydı; sayfadaki diğer yedi ızgaradan
 * ayırt edilemiyordu. Referanstaki düzen üç parçalı: solda tam boy fotoğraf,
 * ortada başlık ve tek paragraf, sağda 2×2 gerekçe kutusu. Sayfanın
 * ortasında ritmi kıran tek büyük an burası.
 */
export async function WhyUs() {
  const t = await getTranslations("whyUs");
  const tFleet = await getTranslations("fleet");

  const reasons = [
    { key: "arabicSupport", icon: MessagesSquare },
    { key: "fixedPrice", icon: Banknote },
    { key: "family", icon: Users },
    { key: "support", icon: Headphones },
  ] as const;

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ background: "var(--brand-night)" }}
    >
      <div className="aurora-veil -z-10" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.85fr_1.2fr] lg:items-center lg:gap-12">
          {/*
            İki fotoğraf üst üste. Tek fotoğraf bu bölümü bir "stok görsel +
            metin" bloğu gibi gösteriyordu; ikincisi (aracın içi) hem
            editoryal bir derinlik veriyor hem de "konfor" iddiasını
            gösteriyor — anlatmak yerine.
          */}
          <div className="relative pb-14 pe-12 lg:pb-16 lg:pe-14">
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
            >
              <Image
                src="/images/chauffeur.jpg"
                alt={t("arabicSupport.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 26vw"
                className="object-cover object-[center_30%]"
              />
            </div>

            <div
              className="absolute end-0 bottom-0 aspect-[4/3] w-[58%] overflow-hidden border-4"
              style={{
                borderColor: "var(--brand-night)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-e3)",
              }}
            >
              <Image
                src="/images/fleet/vito-interior.jpg"
                alt={tFleet("interiorAlt")}
                fill
                sizes="(max-width: 1024px) 60vw, 16vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            {/* "NEDEN BİZ" etiketi kaldırıldı: altındaki başlık zaten
                "Neden Rufai Turizm?" — etiket sorunun kısaltılmış hâliydi. */}
            <h2 className="font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[40px]">
              {t("title")}
            </h2>
            <p className="mt-5 text-[14.5px] leading-[1.8] text-white/62">{t("subtitle")}</p>
          </div>

          {/*
            Sıra numaraları kaldırıldı ve `ol` → `ul` oldu.

            Her maddenin başında altın renkli "01, 02, 03, 04" duruyordu.
            Numaralandırmak bir İDDİADIR: bu şeyler bu sırayla olur.
            Oysa buradakiler — Arapça destek, sabit fiyat, aileye uygun
            program, 7/24 ulaşılabilirlik — sıralı değil, hiçbiri
            diğerinin öncesi ya da sonrası değil. Numara editoryal
            tasarımdan ödünç alınmış bir kostümdü; `ol` etiketi de aynı
            yanlış iddiayı ekran okuyucuya söylüyordu.

            Gerçekten sıralı olan yerlerde numara duruyor: transferin
            "nasıl çalışıyoruz" adımları ve tur programlarının günleri.
          */}
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {reasons.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-4">
                <span className="icon-tile size-11 shrink-0" aria-hidden="true">
                  <Icon className="size-[19px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15.5px] font-bold text-white">{t(`${key}.title`)}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-white/58">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
