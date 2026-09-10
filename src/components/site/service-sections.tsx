import { getTranslations } from "next-intl/server";
import { headingId } from "@/lib/heading-id";
import { ProseSection } from "./prose-section";

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

export async function ServiceSections({
  serviceKey,
  /*
   * Hangi mesaj ad alanından okunacağı.
   *
   * Aynı düzen hem hizmet hem tur sayfalarında gerekiyordu: ikisinde de
   * ziyaretçi tek bir soruya cevap arıyor ve ikisinde de sabit alanlar
   * yetmiyordu. Ad alanını dışarıdan almak, bileşeni kopyalamaktan iyi.
   */
  namespace = "services",
}: {
  serviceKey: string;
  namespace?: "services" | "tours";
}) {
  const t = await getTranslations(namespace);
  if (!t.has(`${serviceKey}.sections`)) return null;

  const bolumler = t.raw(`${serviceKey}.sections`) as Bolum[] | undefined;
  if (!Array.isArray(bolumler) || bolumler.length === 0) return null;

  const tCommon = await getTranslations("common");

  return (
    <div className="pb-4">
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
        <nav
          aria-label={tCommon("contents")}
          className="mx-auto mb-12 w-full max-w-7xl px-5 sm:px-8"
        >
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
          <ProseSection
            key={bolum.heading}
            title={bolum.heading}
            body={bolum.body}
            index={index}
            scale="run"
            reveal
          />
        ))}
      </div>
    </div>
  );
}
