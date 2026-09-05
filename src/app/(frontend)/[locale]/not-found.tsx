import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";

/**
 * 404 sayfası.
 *
 * Varsayılan Next.js 404'ü İngilizce ve tasarımsızdı; Arapça bir ziyaretçi
 * için çıkmaz sokak. Sonraki hali dilinde ama çıplak bir metin bloğuydu.
 *
 * Bu işte yanlış bağlantıya tıklayan müşteriyi kaybetmemek doğrudan gelir
 * kalemi: sayfa artık sitenin geri kalanıyla aynı dili konuşuyor ve
 * ziyaretçiye üç çıkış sunuyor — ana sayfa, WhatsApp ve bölümlerin tamamı.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const links = [
    { href: "/transfer" as const, label: tNav("transfer") },
    { href: "/tours" as const, label: tNav("tours") },
    { href: "/services" as const, label: tNav("services") },
    { href: "/hotels" as const, label: tNav("hotels") },
    { href: "/guides" as const, label: tNav("guides") },
    { href: "/about" as const, label: tNav("about") },
    { href: "/faq" as const, label: tNav("faq") },
    { href: "/contact" as const, label: tNav("contact") },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate flex min-h-[62vh] items-center">
        <Image
          src="/images/hero-ortakoy.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 scrim-x" />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <span className="icon-tile mb-7 size-14" aria-hidden="true">
            <Compass className="size-6" />
          </span>

          <div
            className="font-display text-[78px] font-semibold leading-none tabular-nums sm:text-[108px]"
            style={{ color: "var(--brand-gold)" }}
          >
            404
          </div>

          <h1 className="mt-5 font-display text-[28px] font-semibold leading-snug text-white sm:text-[38px]">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-lg text-[15.5px] leading-[1.85] text-white/75">{t("desc")}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-[0.8rem] px-7 py-4 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5"
              style={{
                background: "var(--brand-gold)",
                color: "var(--brand-night)",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              {t("home")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>

            <WhatsAppLink
              className="inline-flex items-center gap-2.5 rounded-[0.8rem] px-7 py-4 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--brand-wa)" }}
            >
              <WhatsAppIcon className="size-[18px]" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Bölümlerin tamamı: aranan sayfa yoksa bile gidilecek yer bellidir */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="accent-card block p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-bold">{link.label}</span>
                <ArrowRight
                  className="size-4 shrink-0 rtl:rotate-180"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
