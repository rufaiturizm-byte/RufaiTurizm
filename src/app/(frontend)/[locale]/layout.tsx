import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import "../../globals.css";

const geist = Geist({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
  const tHero = await getTranslations({ locale, namespace: "home.hero" });

  return {
    metadataBase: new URL("https://rufaiturizm.com"),
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: tHero("subtitle"),
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

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${geist.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
