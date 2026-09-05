/**
 * Başlıktan bağlantı kimliği üretir — Türkçe ve Arapça harfleri korur.
 *
 * Bilerek ayrı dosyada: içindekiler bileşeni `"use client"` taşıyor ve o
 * modülden dışa aktarılan bir fonksiyon sunucu bileşeninde çağrıldığında
 * gerçek fonksiyon değil istemci referansı geliyor — çağrı çalışma anında
 * patlıyor. Kimlik üretimi hem sunucuda (başlık id'si) hem istemcide
 * (içindekiler bağlantısı) gerektiği için buraya taşındı.
 */
export function headingId(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]/gu, "")
    .slice(0, 40);
  return slug ? `${slug}-${index + 1}` : `bolum-${index + 1}`;
}
