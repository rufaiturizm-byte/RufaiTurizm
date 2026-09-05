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
};

export default withNextIntl(nextConfig);
