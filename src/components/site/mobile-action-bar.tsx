"use client";

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

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t px-4 pt-3 lg:hidden"
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
        className="flex w-full items-center justify-center gap-2.5 rounded-[0.8rem] py-3.5 text-[15px] font-bold text-white"
        style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e2)" }}
      >
        <WhatsAppIcon className="size-5" />
        {t("whatsapp")}
      </a>
    </div>
  );
}
