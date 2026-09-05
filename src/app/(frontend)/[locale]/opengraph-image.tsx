import { ImageResponse } from "next/og";

/**
 * Bağlantı önizleme kartı (og:image).
 *
 * Şehir adı bilerek ASCII "Istanbul": ImageResponse'un varsayılan fontunda
 * Türkçe "İ" (U+0130) bulunmayabiliyor ve eksik glif kartta boş kutu olarak
 * çıkıyor. Kart zaten dil bağımsız olduğu için ASCII yazım kayıp sayılmaz.
 *
 * Bu işte trafiğin büyük kısmı WhatsApp'ta paylaşılan bağlantıdan geliyor;
 * grupta çıkan kart çoğu zaman markayla ilk temas oluyor. Kartta og:image
 * yoksa WhatsApp yalnız çıplak metin gösterir.
 *
 * Metin bilerek dil bağımsız: marka adı, hizmet başlıkları ve şehirler.
 * Arapça yazı için ImageResponse'a ayrıca font dosyası yüklemek gerekirdi;
 * üç dilde tek kart kullanmak hem daha sağlam hem de kartın tanınırlığını
 * bozmuyor.
 */
export const alt = "Rufai Tourism — VIP transfer and private tours in Türkiye";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NIGHT = "#1B2537";
const GOLD = "#C9A961";
const CREAM = "#FAF7F0";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NIGHT,
          padding: "70px 78px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 999,
              border: `3px solid ${GOLD}`,
              color: GOLD,
              fontSize: 46,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: CREAM,
                letterSpacing: 8,
                lineHeight: 1,
              }}
            >
              RUFAI
            </div>
            <div
              style={{
                fontSize: 19,
                color: GOLD,
                letterSpacing: 16,
                marginTop: 12,
              }}
            >
              TOURISM
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {["VIP TRANSFER", "PRIVATE TOURS", "AIRPORT MEET & GREET"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "13px 24px",
                  borderRadius: 999,
                  border: `1px solid ${GOLD}`,
                  color: CREAM,
                  fontSize: 22,
                  letterSpacing: 2,
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "rgba(250,247,240,0.72)" }}>
            Istanbul · Bursa · Sapanca · Trabzon · Bodrum
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 4, background: GOLD, width: 190 }} />
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: CREAM,
              letterSpacing: 2,
            }}
          >
            rufaiturizm.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
