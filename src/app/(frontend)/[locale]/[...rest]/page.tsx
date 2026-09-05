import { notFound } from "next/navigation";

/**
 * Tanımsız yolları yerelleştirilmiş 404'e yönlendirir.
 *
 * next-intl ara katmanı bilinmeyen bir yolu dil bölümüne yeniden yazmıyor,
 * bu yüzden /tr/olmayan-sayfa Next'in İngilizce varsayılan 404'üne düşüyordu.
 * Bu yakalayıcı rota isteği [locale] bölümünün içinde tutuyor; böylece
 * ziyaretçi kendi dilinde bir 404 ve ana bölümlere çıkış görüyor.
 */
export default function CatchAllNotFound() {
  notFound();
}
