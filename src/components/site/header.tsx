import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { WhatsAppLink } from "./whatsapp-cta";

/** Koyu zeminli üst çubuk — referans tasarımdaki gece lacivert + altın düzen. */
export async function Header() {
  const t = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const items = [
    { href: "/" as const, label: t("home") },
    { href: "/tours" as const, label: t("tours") },
    { href: "/services" as const, label: t("services") },
    { href: "/about" as const, label: t("about") },
    { href: "/faq" as const, label: t("faq") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--brand-night) 92%, transparent)",
        borderColor: "var(--brand-night-3)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Rufai Tourism">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14.5px] font-medium text-white/72 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <WhatsAppLink
            className="cta-gold hidden px-5 py-2.5 text-[14px] font-semibold sm:inline-flex"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            {tCta("bookNow")}
          </WhatsAppLink>
        </div>
      </div>
    </header>
  );
}
