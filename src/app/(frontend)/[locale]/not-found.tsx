import { getTranslations } from "next-intl/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";

/**
 * 404 sayfası.
 *
 * Varsayılan Next.js 404'ü İngilizce ve tasarımsızdı; Arapça bir ziyaretçi
 * için çıkmaz sokak. Burada hem dilinde bir açıklama hem de ana bölümlere
 * ve WhatsApp'a çıkış var — yanlış bağlantıya tıklayan müşteriyi kaybetmemek
 * bu işte doğrudan gelir kalemi.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const links = [
    { href: "/tours" as const, label: tNav("tours") },
    { href: "/services" as const, label: tNav("services") },
    { href: "/faq" as const, label: tNav("faq") },
    { href: "/contact" as const, label: tNav("contact") },
  ];

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <div
        className="text-[72px] font-extrabold leading-none sm:text-[96px]"
        style={{ color: "var(--brand-gold)" }}
      >
        404
      </div>

      <h1 className="mt-6 text-[26px] font-bold sm:text-[32px]">{t("title")}</h1>
      <p className="mt-4 max-w-lg text-[15.5px] leading-[1.85] text-muted-foreground">
        {t("desc")}
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[14.5px] font-bold"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {t("home")}
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
        <WhatsAppLink
          className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[14.5px] font-bold text-white"
          style={{ background: "var(--brand-wa)" }}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {tCta("whatsapp")}
        </WhatsAppLink>
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[14px]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
