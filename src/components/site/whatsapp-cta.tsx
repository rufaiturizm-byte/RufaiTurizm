"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "./icons";

/**
 * WhatsApp bağlantısı üretir.
 *
 * Rakip analizinden çıkan taktik: mesajın içine hem hazır bir metin hem de
 * ziyaretçinin bulunduğu sayfanın adresi gömülür. Böylece müşteri tek dokunuşla
 * yazmaya başlar ve hangi tur/hizmet sayfasından geldiği baştan bellidir.
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
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

/** Sayfanın köşesinde sabit duran yüzen WhatsApp düğmesi. */
export function WhatsAppFloatingButton({ subject }: { subject?: string }) {
  const t = useTranslations("cta");
  const href = useWhatsAppUrl(subject);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      data-analytics="whatsapp-floating"
      className={cn(
        "fixed bottom-5 z-50 flex items-center gap-2 rounded-full",
        "end-5 bg-[#25D366] px-4 py-3 text-white shadow-lg",
        "transition-transform hover:scale-105 active:scale-95",
      )}
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden text-sm font-medium sm:inline">{t("whatsapp")}</span>
    </a>
  );
}
