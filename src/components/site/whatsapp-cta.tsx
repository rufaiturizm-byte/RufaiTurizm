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
  className,
  style,
  children,
}: {
  subject?: string;
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
 * Çözüm düğmeyi taşımak değil, gereksiz olduğu anda çekmek: ekranda zaten
 * görünür bir WhatsApp çağrısı varken köşedeki ikinci çağrı hem fazlalık
 * hem engel. Görünür çağrı kalmayınca geri geliyor.
 */
export function WhatsAppFloatingButton({ subject }: { subject?: string }) {
  const t = useTranslations("cta");
  const href = useWhatsAppUrl(subject);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-wa-inline]");
    if (!targets.length) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setHidden(visible.size > 0);
      },
      /* Biraz erken çekilsin: düğme çağrının tam üstüne gelmeden önce. */
      { rootMargin: "-40px 0px -40px 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

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
