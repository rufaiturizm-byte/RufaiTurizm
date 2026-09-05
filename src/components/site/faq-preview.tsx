import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Ana sayfadaki SSS özeti — ilk beş soru.
 *
 * Ziyaretçinin en çok takıldığı yerler (fiyat sabit mi, rehber Arapça mı,
 * karşılama nasıl) ana sayfada cevaplanınca WhatsApp'a yazmadan önceki
 * tereddüt azalıyor. Yapısal veri bilerek yok: FAQPage şeması yalnız /sss
 * sayfasında duruyor, iki yerde aynı soruları işaretlemek gereksiz.
 */
export async function FaqPreview() {
  const t = await getTranslations("faq");
  const tEyebrow = await getTranslations("eyebrow");

  const items = (["1", "2", "3", "4", "5"] as const).map((n) => ({
    question: t(`q${n}`),
    answer: t(`a${n}`),
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("faq")}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link
            href="/faq"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
          >
            {t("allQuestions")}
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        }
      />

      <div className="max-w-3xl">
        <Accordion multiple={false} className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`home-faq-${index}`}>
              <AccordionTrigger className="text-start text-[15.5px] font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] leading-[1.85] text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
