import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone, Sparkle } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { siteConfig, hasRealPhone } from "@/config/site";
import { tours } from "@/data/tours";

/**
 * Altbilgi.
 *
 * Sütun başlıkları referansta beyaz değil altın: koyu zeminde dört beyaz
 * blok yan yana gelince hangisinin başlık hangisinin bağlantı olduğu
 * seçilmiyordu. İletişim satırlarındaki simgeler de aynı işi görüyor —
 * e-posta, şehir ve çalışma saati tek bakışta ayrışıyor.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tTours = await getTranslations("tours");
  const tContact = await getTranslations("contact");
  const tCredentials = await getTranslations("credentials");
  const tCta = await getTranslations("cta");

  const heading = "mb-5 text-[12px] font-extrabold uppercase tracking-[0.18em]";
  const link = "text-[13.5px] transition-colors hover:text-white";

  const quickLinks = [
    { href: "/" as const, label: tNav("home") },
    { href: "/transfer" as const, label: tNav("transfer") },
    { href: "/tours" as const, label: tNav("tours") },
    { href: "/services" as const, label: tNav("services") },
    { href: "/hotels" as const, label: tNav("hotels") },
    { href: "/guides" as const, label: tNav("guides") },
    { href: "/about" as const, label: tNav("about") },
    { href: "/faq" as const, label: tNav("faq") },
    { href: "/contact" as const, label: tNav("contact") },
  ];

  /* lucide artık marka logosu taşımıyor (v1'de kaldırıldı); Instagram ve
     WhatsApp işaretleri bu yüzden elde çizili. */
  const socials = [
    siteConfig.social.instagram
      ? { href: siteConfig.social.instagram, icon: InstagramIcon, label: t("instagram") }
      : null,
    {
      href: `https://wa.me/${siteConfig.whatsappNumber}`,
      icon: WhatsAppIcon,
      label: tCta("whatsapp"),
    },
    { href: `mailto:${siteConfig.email}`, icon: Mail, label: tContact("emailTitle") },
  ].filter((item) => item !== null);

  return (
    <footer style={{ background: "var(--brand-night)" }} className="text-white/62">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.15fr]">
          <div>
            <Logo sub="TURİZM" size={52} flourish />
            <p className="mt-6 max-w-[290px] text-[13.5px] leading-[1.85]">{t("about")}</p>

            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-white/8"
                  style={{
                    borderColor: "color-mix(in oklab, var(--brand-gold) 42%, transparent)",
                    color: "var(--brand-gold)",
                  }}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={heading} style={{ color: "var(--brand-gold-label)" }}>
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={heading} style={{ color: "var(--brand-gold-label)" }}>
              {tNav("tours")}
            </h3>
            <ul className="space-y-3">
              {tours.map((tour) => (
                <li key={tour.key}>
                  <Link
                    href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
                    className={link}
                  >
                    {tTours(`${tour.key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={heading} style={{ color: "var(--brand-gold-label)" }}>
              {t("contactUs")}
            </h3>
            <ul className="space-y-3.5 text-[13.5px]">
              {hasRealPhone ? (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
                  <span dir="ltr">{siteConfig.phoneDisplay}</span>
                </li>
              ) : null}
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
                {siteConfig.address.city}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
                {tContact("hoursValue")}
              </li>
            </ul>
          </div>
        </div>

        {/* Ayırıcı — ortasında markanın yıldızı, sağ ve sol çizgiyi bölerek. */}
        <div className="mt-14 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />
          <Sparkle className="size-4" style={{ color: "var(--brand-gold)" }} />
          <span className="h-px flex-1" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />
        </div>

        <div className="mt-7 flex flex-col gap-4 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {siteConfig.legalName} — {t("allRights")}</span>
          {siteConfig.credentials.tursab ? (
            <a
              href={siteConfig.tursabVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-[0.6rem] bg-white px-3.5 py-2.5 transition-opacity hover:opacity-90"
            >
              <Image
                src="/brand/tursab.png"
                alt={tCredentials("logoAlt")}
                width={104}
                height={26}
                className="h-[20px] w-auto"
              />
              <span
                className="border-s ps-3 text-[11.5px] font-bold text-[color:var(--brand-night)]"
                style={{ borderColor: "color-mix(in oklab, var(--brand-night) 18%, transparent)" }}
              >
                {tCredentials("docNo")}: {siteConfig.credentials.tursab}
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
