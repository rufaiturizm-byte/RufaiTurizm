import Image from "next/image";

/**
 * Marka amblemi.
 *
 * Bir süre elle çizilmiş SVG'ydi: elimizdeki tek dosya 150×150 piksellik bir
 * JPEG olduğu için amblem yeniden çizilmişti. Asıl dosya (1254×1254 PNG)
 * gelince o çizim gereksizleşti — yaklaşık bir kopya yerine logonun kendisi
 * duruyor artık.
 *
 * `public/brand/logo.png` ham dosya değil: turuncu halkanın hemen dışı
 * şeffaflaştırıldı, kare beyaz zemin atıldı ve daire kırpıldı. Halkanın İÇİ
 * bilerek beyaz bırakıldı, çünkü logo zaten beyaz zeminli yuvarlak bir rozet
 * olarak tasarlanmış: koyu üst çubukta beyaz rozet olarak oturuyor, açık
 * zeminde de kenarı belli oluyor. Şeffaf yapılsaydı koyu mavi çizgiler koyu
 * mavi header'da kaybolurdu.
 */
export function Logo({
  className = "",
  tone = "light",
  sub = "TOURISM",
  /*
   * Rozetin boyutu.
   *
   * 40 pikselde amblem okunmuyordu: dairenin içinde "Rufai" yazısı, beş
   * yıldız ve şerit var; bu kadar ayrıntı o ölçekte lapa oluyor. 48 piksel
   * üst çubuğun yüksekliğini (64px) zorlamadan ayrıntıyı geri getiriyor.
   */
  size = 48,
  flourish = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  /** Amblemin altındaki küçük yazı. */
  sub?: string;
  /** Rozetin kenar uzunluğu (px). */
  size?: number;
  /** Alt yazının iki yanına ince altın çizgi çeker — altbilgi düzeni. */
  flourish?: boolean;
}) {
  const ink = tone === "light" ? "#fff" : "var(--foreground)";
  const subColor = tone === "light" ? "rgba(255,255,255,0.58)" : "var(--muted-foreground)";
  const rule = "color-mix(in oklab, var(--brand-gold) 62%, transparent)";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/logo.png"
        /*
         * alt boş: görselin hemen yanında marka adı YAZILI olarak
         * duruyor ("RUFAI" + alt yazı). Dolu bir alt metin ekran
         * okuyucuya aynı şeyi iki kez söyletiyordu. Ayrıca sabit
         * "Rufai Turizm" dizesi Arapça sayfalarda da Latin harfle
         * okunuyordu: 59 Arapça sayfanın her birinde iki kez, toplam
         * 118 yerde. Süs görselin doğru alt metni boş olandır.
         */
        alt=""
        width={size}
        height={size}
        /* Küçük ve her sayfada; üst çubukta geç yüklenmesi göze batıyor. */
        priority
        className="shrink-0"
        style={{ width: size, height: size }}
      />

      <div className="leading-none">
        <div
          className="font-bold tracking-wide"
          style={{ color: ink, fontSize: size >= 48 ? "22px" : "17px" }}
        >
          RUFAI
        </div>
        <div className="mt-1 flex items-center gap-2">
          {flourish ? <span className="h-px w-4" style={{ background: rule }} /> : null}
          <span className="text-[9px] tracking-[0.34em]" style={{ color: subColor }}>
            {sub}
          </span>
          {flourish ? <span className="h-px w-4" style={{ background: rule }} /> : null}
        </div>
      </div>
    </div>
  );
}
