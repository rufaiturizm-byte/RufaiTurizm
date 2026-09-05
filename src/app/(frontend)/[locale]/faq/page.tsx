import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/site/page-hero";
import { FaqSchema } from "@/components/site/json-ld";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9", "10", "11", "12",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const items = QUESTIONS.map((number) => ({
    question: t(`q${number}`),
    answer: t(`a${number}`),
  }));

  return (
    <main className="flex flex-1 flex-col">
      <FaqSchema items={items} />

      <PageHero
        image="/images/kizkulesi.jpg"
        imageAlt={locale === "ar" ? "برج الفتاة في إسطنبول" : "Kız Kulesi, İstanbul"}
        breadcrumb={`${tNav("home")} · ${t("title")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
        <Accordion multiple={false} className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-start text-[16px] font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14.5px] leading-[1.85] text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-xl border p-8 text-center">
          <p className="text-[15.5px] font-semibold">{t("subtitle")}</p>
          <WhatsAppLink
            className="mt-5 inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[14.5px] font-bold"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            {tCta("whatsapp")}
          </WhatsAppLink>
        </div>
      </section>
    </main>
  );
}
