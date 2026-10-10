import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/lib/metadata";
import { LegalDocPage } from "@/components/site/legal-doc";
import { legalDocByKey } from "@/data/legal";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = legalDocByKey("privacy");
  const lang = locale as Locale;

  return {
    title: doc.title[lang] ?? doc.title.tr,
    description: doc.intro[lang] ?? doc.intro.tr,
    alternates: alternatesFor("/privacy", locale),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalDocPage docKey="privacy" locale={locale} />;
}
