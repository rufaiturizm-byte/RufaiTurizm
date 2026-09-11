import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone, Sparkle } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { siteConfig, hasRealPhone } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { tours } from "@/data/tours";
import { services } from "@/data/services";

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
  const tServices = await getTranslations("services");
  const tContact = await getTranslations("contact");
  const tCredentials = await getTranslations("credentials");
  const tCta = await getTranslations("cta");

  const heading = "mb-5 text-[13px] font-bold";
  /*
   * Dikey dolgu dokunma alanı için, süs değil.
   *
   * Telefonda ölçtüm: altbilgideki on yedi bağlantı 14 piksel yüksekliğinde
   * kutular olarak çıkıyordu. WCAG 2.5.8 en az 24×24 piksel istiyor ve
   * sebebi somut — 14 piksellik bir hedefe parmakla isabet ettirmek zor,
   * yaşlı ya da titremesi olan kullanıcı için neredeyse imkânsız.
   * `inline-block` + `py-1.5` hedefi 26 piksele çıkarıyor, görünüm aynı
   * kalıyor çünkü satır aralığı zaten o boşluğu taşıyordu.
   */
  const link =
    "inline-block py-1.5 text-[13.5px] transition-colors hover:text-white";

  const quickLinks = [
    { href: "/" as const, label: tNav("home") },
    { href: "/transfer" as const, label: tNav("transfer") },
    { href: "/tours" as const, label: tNav("tours") },
    { href: "/destinations" as const, label: tNav("destinations") },
    { href: "/packages" as const, label: tNav("packages") },
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
      /* Sitedeki 3.924 WhatsApp bağlantısından tek ön metinsiz olan buydu
         (sayfa başına bir tane, 73 sayfa): dokunan misafir boş bir sohbet
         açıyordu ve karşı taraf hangi sayfadan geldiğini bilmiyordu.
         Sayfa adresi eklenemiyor çünkü altbilgi sunucu bileşeni ve yolu
         bilmiyor; selamlama iki nokta ile bitiyor, imleç oraya düşüyor. */
      href: buildWhatsAppUrl({ message: tCta("whatsappMessage") }),
      icon: WhatsAppIcon,
      label: tCta("whatsapp"),
    },
    { href: `mailto:${siteConfig.email}`, icon: Mail, label: tContact("emailTitle") },
  ].filter((item) => item !== null);

  return (
    <footer style={{ background: "var(--brand-night)" }} className="text-white/62">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        {/*
          En dar ekranda dört blok alt alta ve aralarında 48 piksel boşluk
          vardı: altbilgi 390 pikselde 1.876 piksel oluyordu, yani iki
          ekrandan uzun. Kapanış bandından sonra bu kadar altbilgi
          kaydırmak sayfayı bitmez gösteriyor.

          Artık bağlantı sütunları en dar ekranda da iki sütun; marka
          bloğu tam genişlikte kalıyor çünkü içinde logo ve paragraf var.
        */}
        <div className="grid grid-cols-2 gap-x-7 gap-y-10 sm:gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.15fr]">
          <div className="col-span-2 lg:col-span-1">
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
            {/*
              ALTBİLGİDE ÖN YÜKLEME KAPALI — küçük ama bedava bir kazanç.

              Next.js `<Link>` görüş alanına giren her bağlantının hedefini
              arka planda indiriyor. Altbilgideki 21 bağlantının HEPSİ
              zaten üst menüde ya da sayfa gövdesinde geçen yollar; yani
              altbilgi tek bir yeni hedef bile getirmiyor, aynı rotaları
              ikinci kez istiyor.

              ÖLÇÜLDÜ, tahmin değil: bu bayrak 21 isteği kaldırıyor ama
              yalnız 31 KB kazandırıyor (%1). Sebebi, ikinci isteğin tam
              sayfa değil küçük bir fark yükü indirmesi. Yani buradaki
              asıl kazanç bant genişliği değil, 21 gereksiz HTTP isteğinin
              ve bağlantı/CPU yükünün kalkması.

              Gezinme hızından hiçbir şey gitmiyor: rotalar header ve
              gövde sayesinde zaten önbellekte, altbilgiden tıklayınca da
              anında açılıyorlar. (Bu Next sürümünde `prefetch={false}`
              hover'da da kapatıyor — bkz. node_modules/next/dist/docs,
              link.md — ama burada kapatacak bir şey kalmıyor.)

              Sayfadaki asıl ön yükleme kütlesi burada DEĞİL: ana sayfayı
              sonuna kadar kaydırınca 55 istek / 2.865 KB iniyor ve bunun
              tamamına yakını üst menü ile gövdedeki kart bağlantılarından
              geliyor. Onu küçültmenin doğru yolu Partial Prefetching
              ama o `cacheComponents` istiyor — ayrı bir geçiş.
            */}
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/*
            Hizmet detay sayfaları buraya bilerek eklendi.
            Bağlantı denetiminde çıktı: bölüm sayfaları (turlar, hizmetler,
            transfer) üst menüde olduğu için her sayfadan bağlantı alıyor ve
            53 iç bağlantıya sahipler; hizmet DETAY sayfaları (vito-vip,
            transfer, tours, flight-hotel) ise yalnız 2 bağlantı alıyordu —
            ana sayfa ve hizmet listesi. Yani sitenin ticari niyeti en
            yüksek dört sayfası, en zayıf bağlanan sayfalarıydı. Turlar
            için bu blok zaten vardı; eksik olan aynısının hizmetlerde
            yapılmamış olmasıydı.
          */}
          <div>
            <h3 className={heading} style={{ color: "var(--brand-gold-label)" }}>
              {tNav("services")}
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
                    className={link}
                    prefetch={false}
                  >
                    {tServices(`${service.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={`${heading} mt-9`} style={{ color: "var(--brand-gold-label)" }}>
              {tNav("tours")}
            </h3>
            <ul className="space-y-3">
              {tours.map((tour) => (
                <li key={tour.key}>
                  <Link
                    href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
                    className={link}
                    prefetch={false}
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
                <a href={`mailto:${siteConfig.email}`} className="inline-block py-1 transition-colors hover:text-white">
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

        {/* /45 iken kontrast 4,08:1 idi, WCAG AA 4,5 istiyor. */}
        <div className="mt-7 flex flex-col gap-4 text-[12.5px] text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {siteConfig.legalName} — {t("allRights")}</span>
          {siteConfig.credentials.tursab ? (
            <a
              href={siteConfig.tursabVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-[0.625rem] bg-white px-3.5 py-2.5 transition-opacity hover:opacity-90"
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
