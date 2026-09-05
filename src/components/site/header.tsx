import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { WhatsAppLink } from "./whatsapp-cta";
import { MobileNav } from "./mobile-nav";

/**
 * Koyu zeminli üst çubuk.
 *
 * Rezervasyon düğmesi referansta dolu altın değil, altın çerçeveli ve
 * içi boş: koyu çubukta dolu bir blok gözü menüden çalıyordu, çerçeveli
 * hali aynı vurguyu sakin tutuyor. Ok işareti düğmenin bir yere GİTTİĞİNİ
 * söylüyor — WhatsApp'a.
 */
export async function Header() {
  const t = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const items = [
    { href: "/" as const, label: t("home") },
    { href: "/transfer" as const, label: t("transfer") },
    { href: "/tours" as const, label: t("tours") },
    { href: "/services" as const, label: t("services") },
    { href: "/guides" as const, label: t("guides") },
    { href: "/about" as const, label: t("about") },
    { href: "/faq" as const, label: t("faq") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--brand-night) 92%, transparent)",
        borderColor: "color-mix(in oklab, white 8%, transparent)",
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Rufai Tourism">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-white/72 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <WhatsAppLink
            className="hidden items-center gap-2.5 rounded-[0.7rem] border px-5 py-2.5 text-[14px] font-semibold transition-colors hover:bg-[color:color-mix(in_oklab,var(--brand-gold)_12%,transparent)] sm:inline-flex"
            style={{
              borderColor: "color-mix(in oklab, var(--brand-gold) 62%, transparent)",
              color: "var(--brand-gold)",
            }}
          >
            {tCta("bookNow")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </WhatsAppLink>
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
