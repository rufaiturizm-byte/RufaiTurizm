import { siteConfig } from "@/config/site";

/**
 * WhatsApp bağlantısı üretir.
 *
 * Rakip analizinden çıkan taktik: mesajın içine hem hazır bir metin hem de
 * ziyaretçinin bulunduğu sayfanın adresi gömülür. Böylece müşteri tek
 * dokunuşla yazmaya başlar ve hangi tur/hizmet sayfasından geldiği baştan
 * bellidir.
 *
 * Burada, whatsapp-cta.tsx'in içinde değil: o dosya "use client" ve altbilgi
 * bir SUNUCU bileşeni. Altbilginin WhatsApp ikonu bu yüzden bağlantıyı elle
 * kuruyordu ve tek çıplak bağlantı oydu — 73 sayfada ön metinsiz. Üretici
 * saf bir fonksiyon, istemciye ait bir yanı yok.
 */
export function buildWhatsAppUrl({
  number = siteConfig.whatsappNumber,
  message,
  pageUrl,
}: {
  number?: string;
  message: string;
  pageUrl?: string;
}) {
  const body = pageUrl ? `${message}\n${pageUrl}` : message;
  return `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
}
