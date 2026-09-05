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
const displayLatin = Playfair_Display({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const displayArabic = Amiri({
  variable: "--font-display-family",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
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

  const rtl = isRtl(locale as Locale);
  const display = rtl ? displayArabic : displayLatin;

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${tajawal.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>
          <SmoothScroll />
          <Header />
          {children}
          <Footer />
          <WhatsAppFloatingButton />
          <BackToTop />
        </NextIntlClientProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
