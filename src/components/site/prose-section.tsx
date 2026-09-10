import { headingId } from "@/lib/heading-id";

/**
 * Başlık solda, metin sağda uzun metin bölümü.
 *
 * Bu düzen sitede beş ayrı yerde elle yazılmıştı (şehirler sayfası girişi,
 * "kaç şehir birleştirilir", paketler girişi ve "kaç günlük program",
 * bir de uzun bölüm bileşenlerinin içi). İki kopya arasında sütun oranı
 * çoktan ayrışmıştı — paketlerde 0.85/1.15, diğerlerinde 0.8/1.2 — ki
 * kimse fark etmeden ayrışan şey tam olarak budur. Oran 0.8/1.2'de
 * birleşti: dört kullanımın üçü zaten oradaydı.
 *
 * TASARIM. İlk hâli gerçekten düz metindi: serif bir başlık ve altında
 * eşit gri paragraf yığını. Sitenin geri kalanı altın vurgulu kartlar,
 * ikon kutuları ve numaralı rozetlerle kuruluyken bu bölümler
 * biçimlendirilmemiş gibi duruyordu. Üç şey eklendi ve üçü de sistemin
 * kendi sözlüğünden:
 *
 * 1. Başlığın üstünde `eyebrow-rule` — bölümün nerede başladığını
 *    gösteriyor, sayfa boyunca aynı ritmi kuruyor.
 * 2. İlk paragraf giriş cümlesi olarak büyüyor (17,5 / 15,5). Metnin
 *    tamamı tek puntoyken göz nereden başlayacağını bilmiyordu.
 * 3. Kalan paragraflar altın bir dikey çizginin sağında duruyor. Çizgi
 *    mantıksal kenar (`border-s`) olduğu için Arapçada kendiliğinden
 *    sağa geçiyor.
 *
 * Kart (surface-card) denendi ve alındı: bölümler arka arkaya
 * geldiğinde sayfa kutu dizisine dönüyor ve yapışkan başlık kartın
 * içinde kilitleniyordu.
 */
type Olcek = "page" | "run";

export function ProseSection({
  title,
  body,
  items,
  outro,
  className = "",
  eyebrow,
  index,
  scale = "page",
  reveal = false,
}: {
  title: string;
  /** Tek metin `\n\n` ile paragraflara ayrılır; dizi olduğu gibi basılır. */
  body: string | string[];
  /**
   * Gövde aslında bir listeyse maddeler buradan gelir.
   *
   * Bazı bölümlerin metni paragraf olarak yazılmıştı ama içeriği listeydi
   * — "fiyatı dört şey belirliyor" deyip dört şeyi arka arkaya paragraf
   * yapmak gibi. Okuyucu o dördü saymak için metni baştan sona okumak
   * zorunda kalıyordu. Maddeler verilince numaralı kartlara dönüyor;
   * gövde metni giriş cümlesi olarak kalıyor.
   */
  items?: { title: string; body: string }[];
  /** Maddelerden sonra gelen kapanış paragrafı. */
  outro?: string;
  /** Dış boşluk — bölümün sayfadaki yerine göre değişiyor. */
  className?: string;
  /** Başlığın üstündeki küçük etiket. Verilmezse çizgi de basılmıyor. */
  eyebrow?: string;
  /**
   * Arka arkaya sıralanan bölümlerde sıra numarası (0 tabanlı).
   * Numara okuyucuya kaçıncı bölümde olduğunu söylüyor; tek başına
   * duran bir bölümde anlamsız olurdu, o yüzden isteğe bağlı.
   */
  index?: number;
  /**
   * `page`: bölüm tek başına duruyor, sayfa başlığı ölçeğinde (26/32).
   * `run`: arka arkaya bölümlerden biri, bir kademe küçük (24/28) ve
   * üstünde ayırıcı çizgi var.
   */
  scale?: Olcek;
  /** Kaydırınca beliren giriş — bölüm listelerinde açık. */
  reveal?: boolean;
}) {
  const paragraflar = (Array.isArray(body) ? body : body.split("\n\n")).filter(Boolean);
  if (paragraflar.length === 0) return null;

  const [giris, ...kalan] = paragraflar;
  const kosu = scale === "run";

  return (
    <section className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      <div
        className={`grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 ${
          reveal ? "reveal-rise" : ""
        }`}
      >
        <div className="lg:sticky lg:top-28 lg:self-start">
          {eyebrow ? (
            <p className="eyebrow-rule mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}

          <div className="flex items-start gap-3.5">
            {typeof index === "number" ? (
              <span
                aria-hidden="true"
                className="step-badge mt-1 size-8 shrink-0 text-[12.5px] font-extrabold"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <h2
              id={headingId(title, index ?? 0)}
              className={`font-display font-semibold leading-snug scroll-mt-28 ${
                kosu ? "text-[23px] sm:text-[27px]" : "text-[26px] sm:text-[32px]"
              }`}
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="measure flex flex-col gap-5">
          <p className="text-[16.5px] leading-[1.85] text-foreground/95 sm:text-[17.5px]">
            {giris}
          </p>

          {kalan.length > 0 ? (
            <div
              className="flex flex-col gap-4 border-s ps-5 text-[15.5px] leading-[1.95] text-foreground/80 sm:ps-6"
              style={{ borderColor: "color-mix(in oklab, var(--brand-gold) 34%, transparent)" }}
            >
              {kalan.map((paragraf, sira) => (
                <p key={sira}>{paragraf}</p>
              ))}
            </div>
          ) : null}

          {items && items.length > 0 ? (
            <ol className="mt-1 flex flex-col gap-3.5">
              {items.map((madde, sira) => (
                <li key={madde.title} className="accent-card flex gap-4 p-5 sm:gap-5 sm:p-6">
                  <span
                    aria-hidden="true"
                    className="step-badge mt-0.5 size-9 shrink-0 text-[13px] font-extrabold"
                  >
                    {sira + 1}
                  </span>
                  <div>
                    <h3 className="text-[15.5px] font-bold leading-snug">{madde.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.9] text-foreground/80">
                      {madde.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          {outro ? (
            <p className="text-[15.5px] leading-[1.95] text-foreground/85">{outro}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
