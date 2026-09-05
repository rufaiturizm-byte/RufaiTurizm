"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

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
  children,
}: {
  subject?: string;
  className?: string;
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
      <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
      </svg>
      <span className="hidden text-sm font-medium sm:inline">{t("whatsapp")}</span>
    </a>
  );
}
