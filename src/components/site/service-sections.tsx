import { getTranslations } from "next-intl/server";
import { headingId } from "@/lib/heading-id";

/**
 * Hizmet sayfasının uzun bölümleri.
 *
 * Sayfa şablonu sabit alanlarla kuruluydu (long, long2, bestFor, how,
 * note) ve toplam bin kelime civarında kalıyordu. Aynı Arapça sorgular
 * için önde duran rakiplerin sayfaları üç–beş bin kelime: fiyatın nasıl
 * hesaplandığı, kaç kişiye kaç araç gerektiği, şoförle rehber arasındaki
 * fark gibi başlıkları tek tek açıyorlar. Bunlar gerçekten sorulan
 * sorular ve cevapları bizde de var, yazacak yer yoktu.
 *
 * Bölümler mesaj dosyalarında `services.<key>.sections` altında duruyor.
 * Anahtar yoksa bileşen hiç render edilmiyor — bir hizmete bölüm
 * yazılmamışsa sayfada boşluk da kalmıyor.
 *
 * Gövde metni `\n\n` ile paragraflara ayrılıyor; rehberlerde ve şehir
 * sayfalarında kullanılan düzenin aynısı.
 */
type Bolum = { heading: string; body: string };

export async function ServiceSections({ serviceKey }: { serviceKey: string }) {
  const t = await getTranslations("services");
  if (!t.has(`${serviceKey}.sections`)) return null;

  const bolumler = t.raw(`${serviceKey}.sections`) as Bolum[] | undefined;
  if (!Array.isArray(bolumler) || bolumler.length === 0) return null;

  const tCommon = await getTranslations("common");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-4 sm:px-8">
      {/*
        Bölüm dizini.
        Bu bölümler eklendiğinde hizmet sayfası 11 başlıktan 17'ye çıktı ve
        aradığı tek şey için gelen ziyaretçi — çoğu öyle geliyor: "fiyat
        nasıl hesaplanıyor" — onu bulmak için sayfayı baştan sona
        kaydırmak zorunda kalıyordu. Rehberlerdeki yan sütunlu içindekiler
        buraya uymuyor: hizmet sayfası tam genişlikte, üst üste bölümlerden
        kurulu. Çip sırası aynı işi düzeni bozmadan yapıyor.
      */}
      {bolumler.length > 2 ? (
        <nav aria-label={tCommon("contents")} className="mb-12">
          <p className="eyebrow-rule text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            {tCommon("contents")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {bolumler.map((bolum, index) => (
              <li key={bolum.heading}>
                <a
                  href={`#${headingId(bolum.heading, index)}`}
                  className="accent-card inline-flex px-4 py-2 text-[13.5px] font-semibold transition-colors hover:text-[color:var(--brand-gold-deep)]"
                >
                  {bolum.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="flex flex-col gap-14">
        {bolumler.map((bolum, index) => (
          <article
            key={bolum.heading}
            className="reveal-rise grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14"
          >
            <h2
              id={headingId(bolum.heading, index)}
              className="font-display text-[24px] font-semibold leading-snug scroll-mt-28 sm:text-[28px] lg:sticky lg:top-28 lg:self-start"
            >
              {bolum.heading}
            </h2>
            <div className="measure flex flex-col gap-4 text-[15.5px] leading-[1.95] text-foreground/85">
              {bolum.body.split("\n\n").map((paragraf, sira) => (
                <p key={sira}>{paragraf}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
