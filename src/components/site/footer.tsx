import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { siteConfig, hasRealPhone } from "@/config/site";
import { tours } from "@/data/tours";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tTours = await getTranslations("tours");
  const tContact = await getTranslations("contact");
  const tCredentials = await getTranslations("credentials");

  return (
    <footer style={{ background: "var(--brand-night)" }} className="text-white/62">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-[290px] text-[13.5px] leading-[1.85]">{t("about")}</p>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">{t("quickLinks")}</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><Link href="/" className="transition-colors hover:text-white">{tNav("home")}</Link></li>
              <li><Link href="/tours" className="transition-colors hover:text-white">{tNav("tours")}</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-white">{tNav("services")}</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">{tNav("about")}</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-white">{tNav("faq")}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">{tNav("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">{tNav("tours")}</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              {tours.map((tour) => (
                <li key={tour.key}>
                  <Link href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }} className="transition-colors hover:text-white">
                    {tTours(`${tour.key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">{t("contactUs")}</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              {hasRealPhone ? <li dir="ltr">{siteConfig.phoneDisplay}</li> : null}
              <li>{siteConfig.email}</li>
              <li>{siteConfig.address.city}</li>
              <li className="pt-1 text-white/45">{tContact("hoursValue")}</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--brand-night-3)" }}
        >
          <span>© 2026 {siteConfig.legalName} — {t("allRights")}</span>
          {siteConfig.credentials.tursab ? (
            <a
              href={siteConfig.tursabVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-md bg-white px-3 py-2 transition-opacity hover:opacity-90"
            >
              <Image
                src="/brand/tursab.png"
                alt={tCredentials("logoAlt")}
                width={104}
                height={26}
                className="h-[20px] w-auto"
              />
              <span className="text-[11.5px] font-bold text-[color:var(--brand-night)]">
                {tCredentials("docNo")}: {siteConfig.credentials.tursab}
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
