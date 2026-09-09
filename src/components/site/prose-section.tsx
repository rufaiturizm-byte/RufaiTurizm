/**
 * Başlık solda, metin sağda iki sütunlu düz metin bölümü.
 *
 * Bu düzen sitede beş ayrı yerde elle yazılmıştı (şehirler sayfası girişi,
 * "kaç şehir birleştirilir", paketler girişi ve "kaç günlük program",
 * bir de uzun bölüm bileşenlerinin içi). İki kopya arasında sütun oranı
 * çoktan ayrışmıştı — paketlerde 0.85/1.15, diğerlerinde 0.8/1.2 — ki
 * kimse fark etmeden ayrışan şey tam olarak budur. Altıncı ve yedinci
 * kopyayı yazmadan önce tek yere alındı.
 *
 * Oran 0.8/1.2'de birleşti: dört kullanımın üçü zaten oradaydı.
 *
 * Uzun bölüm bileşenleri (LongSections / ServiceSections) bilerek dışarıda
 * kaldı: onların başlığı daha küçük (24/28) çünkü arka arkaya sıralanıyor,
 * burada ise bölüm tek başına duruyor ve sayfa başlığı ölçeğinde (26/32).
 * Aynı görünmeyen iki şeyi tek bileşene sıkıştırmak, farkı bir prop'un
 * arkasına gizlemekten başka işe yaramazdı.
 */
export function ProseSection({
  title,
  body,
  className = "",
}: {
  title: string;
  /** Tek metin `\n\n` ile paragraflara ayrılır; dizi olduğu gibi basılır. */
  body: string | string[];
  /** Dış boşluk — bölümün sayfadaki yerine göre değişiyor. */
  className?: string;
}) {
  const paragraflar = Array.isArray(body) ? body : body.split("\n\n");

  return (
    <section className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <h2 className="font-display text-[26px] font-semibold leading-snug sm:text-[32px] lg:sticky lg:top-28 lg:self-start">
          {title}
        </h2>
        <div className="measure flex flex-col gap-4 text-[15.5px] leading-[1.95] text-foreground/85">
          {paragraflar.map((paragraf, index) => (
            <p key={index}>{paragraf}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
