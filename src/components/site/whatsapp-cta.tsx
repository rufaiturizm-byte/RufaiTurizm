"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "./icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export { buildWhatsAppUrl };


export function useWhatsAppUrl(subject?: string) {
  const t = useTranslations("cta");
  const pathname = usePathname();
  const pageUrl = `${siteConfig.url}${pathname}`;
  const message = subject
    ? `${t("whatsappMessage")} ${subject}`
    : t("whatsappMessage");

  return buildWhatsAppUrl({ message, pageUrl });
}

export function WhatsAppLink({
  subject,
  ariaLabel,
  className,
  style,
  children,
}: {
  subject?: string;
  /**
   * Bağlantının ekran okuyucuya söylenen adı — görünen yazı tek başına
   * hangi bağlantı olduğunu anlatmıyorsa gerekli.
   *
   * "Hizmet verdiğimiz noktalar" bölümü bunu zorunlu kıldı: 59 çipin
   * yedisi birebir aynı yazıyı taşıyor ("Taksim" hem İstanbul
   * Havalimanı hem Sabiha Gökçen grubunda var). Bağlantı listesini
   * gezen biri iki tane "Taksim" duyup hangisinin hangisi olduğunu
   * ayırt edemiyordu; adresleri farklı olduğu hâlde adları aynıydı.
   */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const href = useWhatsAppUrl(subject);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      data-analytics="whatsapp-cta"
      /* Yüzen düğme bu işareti izliyor: ekranda görünür bir WhatsApp
         çağrısı varken köşedeki düğme çekiliyor. */
      data-wa-inline=""
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

/**
 * Sayfanın köşesinde sabit duran yüzen WhatsApp düğmesi.
 *
 * Ekran görüntüsünde çıktı: düğme sayfanın sağ altında sabit durduğu için
 * transfer formunun tam genişlikteki yeşil "teklif al" düğmesinin ÜZERİNE
 * biniyordu — sayfanın en önemli eylemini kendi kopyası kapatıyordu.
 *
 * Çözüm düğmeyi taşımak değil, ÜSTÜNE BİNDİĞİ anda çekmek.
 *
 * İlk hali "ekranda herhangi bir WhatsApp çağrısı görünüyorsa gizlen"
 * diyordu ve bu kural fazla genişti. Tarayıcıda ölçüldü: ana sayfada
 * yirmi üç satır içi çağrı var ve 10.275 piksellik sayfada ölçülen on
 * sekiz kaydırma noktasının HİÇBİRİNDE düğme görünmüyordu — yani düğme
 * fiilen ölüydü. Kural her zaman doğru çıkıyordu.
 *
 * Artık yalnız ekranın ALT ŞERİDİ sayılıyor (`rootMargin` ile alt %25).
 * Düğme zaten orada duruyor; asıl sorun olan "formun gönder düğmesinin
 * üstüne binme" durumu tam olarak o şeritte oluşuyor. Sayfanın ortasındaki
 * bir çağrı düğmeyi artık gizlemiyor, çünkü ona engel de olmuyor.
 *
 * GÖRÜNÜRLÜK ÖLÇÜMDEN SONRA. Düğme kapalı başlıyor ve gözlemci karar
 * verince açılıyor. Önceki hali açık başlıyordu: sunucu HTML'i düğmeyi
 * görünür basıyor, hemen ardından JS gizliyordu ve kullanıcı sayfayı her
 * yenilediğinde düğmenin bir an belirip kaybolduğunu görüyordu.
 */
export function WhatsAppFloatingButton({ subject }: { subject?: string }) {
  const t = useTranslations("cta");
  const href = useWhatsAppUrl(subject);
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-wa-inline]");
    /*
      Sayfada hiç satır içi çağrı yoksa gizlenecek bir sebep de yok.

      Güncelleme bir kare sonraya alınıyor: efektin gövdesinde doğrudan
      `setState` çağırmak zincirleme render tetikleyebiliyor. Gözlemcinin
      geri çağrısı da zaten eşzamansız çalışıyor, yani iki yol da aynı
      anda karar veriyor.
    */
    if (!targets.length) {
      const kare = requestAnimationFrame(() => setGorunur(true));
      return () => cancelAnimationFrame(kare);
    }

    const cakisan = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) cakisan.add(entry.target);
          else cakisan.delete(entry.target);
        }
        setGorunur(cakisan.size === 0);
      },
      /*
        Kök, ekranın yalnız ALT %25'i. Üstteki eksi değer görüş alanının
        üst dörtte üçünü kesiyor; alttaki 40 piksel de düğme çağrının tam
        üstüne gelmeden biraz erken çekilsin diye.
      */
      { rootMargin: "-75% 0px -40px 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const hidden = !gorunur;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      data-analytics="whatsapp-floating"
      /* Mobilde gizli: orada sayfanın altındaki eylem çubuğu var, iki
         WhatsApp çağrısı üst üste binmemeli. */
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed bottom-5 z-50 hidden items-center gap-2 rounded-full lg:flex",
        "end-5 px-4 py-3 text-white",
        "transition-[transform,opacity] hover:scale-105 active:scale-95",
        hidden && "pointer-events-none translate-y-3 opacity-0",
      )}
      /*
       * Renk ve gölge sitenin geri kalanıyla aynı yerden: sabit yeşil ve
       * Tailwind'in siyah `shadow-lg`si sayfadaki tek yabancı yüzeydi.
       *
       * Bu satır bir ara SİLİNMİŞTİ. WhatsApp düğmeleri `.btn-wa` sınıfına
       * geçirilirken buradaki inline stil kaldırıldı ama sınıf bilerek
       * eklenmedi (sınıfın hover transform'u gizlenme animasyonuyla
       * çakışıyor) — geriye arka planı hiç olmayan, krem zeminde beyaz
       * ikon ve beyaz yazı taşıyan bir düğme kaldı. Kontrast 1,06:1.
       *
       * Düğme şu an her sayfada gizli duruyor (sayfada görünür bir satır
       * içi çağrı olduğu sürece kendini gizliyor) ve hata bu yüzden gözle
       * fark edilmiyordu; ama çağrısız bir boşluk oluştuğu ilk anda
       * görünmez bir düğme olarak ortaya çıkardı.
       *
       * Sınıf yerine inline stil: yalnız yüzey ve gölge veriliyor,
       * transform'a dokunulmuyor, çakışma da olmuyor.
       */
      style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e3)" }}
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden text-sm font-medium sm:inline">{t("whatsapp")}</span>
    </a>
  );
}
