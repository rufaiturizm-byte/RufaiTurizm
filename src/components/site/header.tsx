import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
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
  const tBrand = await getTranslations("brand");

  const items = [
    { href: "/" as const, label: t("home") },
    { href: "/transfer" as const, label: t("transfer") },
    { href: "/tours" as const, label: t("tours") },
    { href: "/destinations" as const, label: t("destinations") },
    { href: "/packages" as const, label: t("packages") },
    { href: "/services" as const, label: t("services") },
    { href: "/hotels" as const, label: t("hotels") },
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
        /*
          Alt kenar %8 beyazdı ve lacivert bir bölüm başlığın altından
          geçerken görünmüyordu: koyu bant koyu başlık çubuğuna giriyor,
          arada sınır olmadığı için metin hiçbir şeye çarpmadan kesiliyor
          gibi duruyordu (güven bandı ve kapanış bandı tam olarak o
          renkte). %16'da çizgi lacivertin üstünde okunuyor; krem
          zeminde ise zaten iki farklı renk çarpıştığı için fark
          edilmiyor.
        */
        borderColor: "color-mix(in oklab, white 16%, transparent)",
        /* Açık zeminde ayrımı çizgi değil gölge yapıyor. */
        boxShadow: "0 12px 28px -20px color-mix(in oklab, var(--brand-night) 85%, transparent)",
      }}
    >
      {/*
        Boşluklar küçük ekranda daraltılıyor. 320 pikselde logo + dil
        değiştirici + menü düğmesi toplamı kabı 21 piksel aşıyordu ve
        sayfa yatayda 1 piksel kayıyordu. justify-between öğeleri zaten
        iki uca yaydığı için boşluk yalnızca sıkışıkta devreye giriyor:
        360 piksel ve üstünde görünüm birebir aynı kalıyor.
      */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-2 px-5 sm:gap-6 sm:px-8">
        {/* Erişilebilir ad dile göre: Arapça sayfada marka
            "روفاي للسياحة" diye duyurulmalı, "Rufai Tourism" diye değil. */}
        <Link href="/" aria-label={tBrand("name")}>
          <Logo />
        </Link>

        {/* On bir bağlantı lg genişliğinde sıkışıyor; tam menü xl'den
            itibaren, arada mobil menü devrede. Bölgeler eklendiğinde
            2xl'deki geniş boşluk da kaldırıldı: 1536 pikselde menü
            "Rezervasyon" düğmesine dayanıyordu. */}
        <nav className="hidden items-center gap-4 whitespace-nowrap xl:flex 2xl:gap-5">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <WhatsAppLink
            /* whitespace-nowrap şart: menüye "Paketler" eklenince düğme
               daralıp "احجز الآن" iki satıra bölünüyordu. */
            className="hidden shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[0.7rem] border px-5 py-2.5 text-[14px] font-semibold transition-colors hover:bg-[color:color-mix(in_oklab,var(--brand-gold)_12%,transparent)] sm:inline-flex"
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
