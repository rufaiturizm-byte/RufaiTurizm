"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useWhatsAppUrl } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";

/**
 * Telefonda sayfanın altında sabit duran eylem çubuğu.
 *
 * Mobilde tek çağrı yüzen yuvarlak bir WhatsApp düğmesiydi: ekranın
 * köşesinde duruyor, içeriğin üstünü kapatıyor ve küçük olduğu için
 * kaydırırken gözden kaçıyordu. Tam genişlikte bir çubuk hem her an
 * görünür hem parmakla ulaşması kolay.
 *
 * Yalnız WhatsApp var. Telefonla arama düğmesi bilerek yok: sitedeki
 * numara henüz yer tutucu ve tüm dönüşüm zaten WhatsApp üzerinden
 * yürüyor; ikinci bir düğme koymak birinciyi zayıflatır.
 */
export function MobileActionBar() {
  const t = useTranslations("cta");
  const href = useWhatsAppUrl();
  const [hidden, setHidden] = useState(false);

  /*
   * Çubuk, ekranın ALT bölümünde görünür bir WhatsApp çağrısı varken
   * çekiliyor.
   *
   * Telefonda kart içindeki yeşil "Hemen Rezervasyon" düğmesi ile bu
   * çubuk aynı anda görünüyordu: iki büyük yeşil çağrı yan yana
   * birbiriyle yarışıyor ve hangisine basılacağı belirsizleşiyordu.
   * Kart düğmesi daha değerli olan — tur adını da taşıyor, sohbet
   * bağlamla başlıyor; çubuğunki genel. O yüzden çekilen çubuk oluyor.
   *
   * rootMargin bilerek "-62% 0px 0px 0px": yalnız ekranın alt %38'i
   * sayılıyor, yani gerçekten ÇAKIŞTIKLARI bölge. Tüm ekranı saysaydık
   * kart listesinde kaydırırken çubuk sürekli girip çıkar, o da
   * kendi başına rahatsız edici olurdu.
   */
  useEffect(() => {
    const targets = document.querySelectorAll("[data-wa-inline]");
    if (!targets.length) return;

    const visible = new Set<Element>();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        const shouldHide = visible.size > 0;

        /*
         * Çekilme anında, geri gelme gecikmeli.
         *
         * Kart listesinde her kartın çağrısı alt bölgeden geçtiği için
         * durum sık değişiyor; ölçtüm, uzun bir sayfada yirmi dörde
         * kadar çıkıyor. Gecikmesiz haliyle hızlı kaydırırken çubuk
         * çırpınıyordu. Gizlenmek acil (çakışma o an var), geri gelmek
         * değil — 260 ms beklemek çırpınmayı kesiyor, kullanıcı
         * gerçekten durduğunda çubuk geri geliyor.
         */
        if (shouldHide) {
          if (timer) clearTimeout(timer);
          setHidden(true);
        } else {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => setHidden(false), 260);
        }
      },
      { rootMargin: "-62% 0px 0px 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-50 border-t px-4 pt-3 transition-[transform,opacity] duration-300 lg:hidden ${
        hidden ? "pointer-events-none translate-y-full opacity-0" : ""
      }`}
      style={{
        background: "color-mix(in oklab, var(--brand-night) 94%, transparent)",
        borderColor: "color-mix(in oklab, white 10%, transparent)",
        backdropFilter: "blur(10px)",
        /* Çentikli telefonlarda alt gezinme çubuğunun altında kalmasın. */
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="whatsapp-mobile-bar"
        tabIndex={hidden ? -1 : undefined}
        className="btn-wa flex w-full items-center justify-center gap-2.5 rounded-[0.8rem] py-3.5 text-[15px] font-bold text-white"
      >
        <WhatsAppIcon className="size-5" />
        {t("whatsapp")}
      </a>
    </div>
  );
}
