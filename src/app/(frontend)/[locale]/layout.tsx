import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Tajawal, Playfair_Display, Amiri } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFloatingButton } from "@/components/site/whatsapp-cta";
import { BackToTop } from "@/components/site/scroll-helpers";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import "../../globals.css";

const tajawal = Tajawal({
  variable: "--font-brand",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

/*
 * Başlık yazı tipi. Gövde Tajawal kalıyor; başlıklar serif oluyor —
 * tek yazı tipiyle kurulan sayfa karakter taşımıyordu.
 *
 * İki ayrı aile kullanılıyor çünkü tek bir serif her iki yazı sistemini
 * de iyi taşımıyor: Latin için Playfair Display, Arapça için Amiri.
 * İkisi de serif olduğu için marka hissi diller arasında bozulmuyor.
 * Aynı CSS değişkenini paylaşıyorlar, dile göre yalnız biri uygulanıyor.
 */
/*
 * İki ölçüm sonucu buradaki ayarları değiştirdi.
 *
 * 1. AĞIRLIK. Kod tabanındaki 65 `font-display` kullanımının tamamı
 *    `font-semibold`. Playfair'den üç (500/600/700), Amiri'den iki
 *    (400/700) ağırlık indiriliyordu; ikisi de gereğinden fazla.
 *    Amiri'de 600 yok, o yüzden semibold zaten 700'e düşüyor.
 *
 * 2. ÖNYÜKLEME. next/font iki aileyi de statik olarak görüp ikisini de
 *    preload ediyordu: Arapça sayfa hiç kullanmadığı Latin serifini,
 *    Türkçe sayfa hiç kullanmadığı Arapça serifini indiriyordu. Her iki
 *    dilde de on bir font dosyası önyükleniyordu.
 *
 *    `preload: false` ile @font-face kuralı duruyor ama dosya yalnız
 *    eşleşen bir öğe render edildiğinde iniyor — kullanılmayan aile hiç
 *    inmiyor. LCP'ye zarar vermiyor çünkü ölçtüm: LCP öğesi hero
 *    görseli (516 ms), başlık değil. Gövde fontu Tajawal önyüklemesini
 *    KORUYOR, ilk boyanan metin o.
 */
const displayLatin = Playfair_Display({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  preload: false,
});

const displayArabic = Amiri({
  variable: "--font-display-family",
  subsets: ["arabic"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://rufaiturizm.com"),
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: tMeta("home"),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        ar: "/",
        tr: "/tr",
        en: "/en",
        "x-default": "/",
      },
    },
    verification: {
      google: "LkEz3TOB4Fl4zl0wZpe_qL5G0HvViMDKC_rsMdzGdP4",
    },
    openGraph: {
      type: "website",
      siteName: t("name"),
      locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const rtl = isRtl(locale as Locale);
  const display = rtl ? displayArabic : displayLatin;

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${tajawal.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans pb-[72px] lg:pb-0">
        <NextIntlClientProvider>
          {/* Klavyeyle gelen kullanıcı dokuz menü bağlantısını geçmesin. */}
          <a href="#main" className="skip-link">
            {tCommon("skipToContent")}
          </a>
          <SmoothScroll />
          <Header />
          {children}
          <Footer />
          <WhatsAppFloatingButton />
          <MobileActionBar />
          <BackToTop />
        </NextIntlClientProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
