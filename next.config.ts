import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /*
     * Next 16'da izin verilen kalite değerlerini saymak zorunlu; varsayılan
     * yalnız [75] ve yapılandırılmamış bir değer istenirse istek 400 döner.
     *
     * 60: kapak fotoğrafları. Hepsinin üstünde %90'a varan koyu bir
     * karartma var (hero, sayfa başlıkları, güzergâh kapakları) — orada
     * 75 ile 60 arasındaki fark gözle görünmüyor ama dosya belirgin
     * küçülüyor ve bu fotoğraflar sayfanın LCP öğesi.
     * 75: kartlardaki ve galerideki fotoğraflar, karartmasız gösterilenler.
     *
     * minimumCacheTTL bilerek varsayılanda (4 saat) bırakıldı: Next'in
     * görsel önbelleğini geçersiz kılma mekanizması YOK ve künyedeki akış
     * "kendi fotoğrafınızı aynı dosya adıyla koyun" diyor. Uzun TTL,
     * fotoğraf değiştirildikten sonra günlerce eskisini göstermek olurdu.
     */
    qualities: [60, 75],
  },
  experimental: {
    /*
     * Stil dosyası <link> yerine sayfanın içine gömülüyor.
     *
     * NEDEN. Transfer sayfası ölçüldü (PSI mobil, 11 Ekim): LCP 5,7 sn
     * ve bunun 2 saniyesi "element render delay" — görsel inmiş,
     * tarayıcı boyayamıyor. Sebebi render'ı engelleyen 25 KB'lık CSS
     * dosyası: HTML iniyor, ayrıştırılıyor, <link> görülüyor, YENİ bir
     * istek açılıyor. Yavaş mobil bağlantıda o gidiş-dönüş 1.052 ms.
     *
     * Next'in belgesi bu takası açıkça yazıyor: kazanç ilk kez gelen
     * ziyaretçide ve atomik CSS'te (Tailwind) en büyük, bedeli ise
     * dönen ziyaretçinin stili her seferinde yeniden indirmesi.
     * Bu sitede ziyaretçilerin neredeyse tamamı ilk kez geliyor
     * (GA4: 28 günde 38 kullanıcının 32'si yeni) ve hedef pazar
     * mobil bağlantıda — takas bizden yana.
     *
     * Deneysel bir bayrak: ölçüm kötüleşirse tek satır geri alınır.
     */
    inlineCss: true,
  },
};

export default withNextIntl(nextConfig);
