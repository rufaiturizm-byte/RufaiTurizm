import Image from "next/image";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * İç sayfaların üst bandı: koyu zemin, üstte kırıntı yolu, altında başlık.
 * Ana sayfadaki hero ile aynı dili konuşur ama daha alçak.
 */
export function PageHero({
  image,
  imageAlt,
  crumbs,
  title,
  subtitle,
}: {
  image: string;
  imageAlt: string;
  /** Tıklanabilir kırıntı yolu; son öğe bulunduğumuz sayfa. */
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative isolate">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
          quality={60}
        className="-z-10 object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 scrim-x"
      />
      {/*
        Ölçülmüş bir CLS notu — kapağa yükseklik rezerve EDİLMEDİ.

        Oteller sayfasının başlığı ("فنادق إسطنبول وأنطاليا وبودروم")
        yedek yazı tipinde bir satır, Amiri yüklendiğinde iki satır
        oluyor; altındaki her şey 47px kayıyor ve o sayfa 0.0338 CLS
        veriyor. Sitedeki diğer on üç sayfada fark sıfır.

        Sebep next/font'un sınırı: ürettiği "Amiri Fallback" yüzü
        `local(Times New Roman)` üzerine kurulu ve Times'ta Arapça glif
        yok, dolayısıyla Arapça metin ölçüsü hiç ayarlanmamış sistem
        fontuna düşüyor (iOS'ta Geeza Pro, Android'de Noto Naskh —
        üçünü birden eşleştirmek mümkün değil).

        Çözülmedi çünkü her çare daha pahalı: h1'e iki satır rezerve
        etmek tek satırlık on üç başlığın altına 47px boşluk koyuyor,
        başlığı kısaltmak da sayfanın kapsamını (Antalya, Bodrum)
        gizliyor. 0.0338, Google'ın "iyi" eşiğinin (0.1) üçte biri ve
        yalnız ilk ziyarette görünüyor.
      */}
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-20">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.12] tracking-[-0.01em] text-white sm:text-[46px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-white/78">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
