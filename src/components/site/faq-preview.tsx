import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Minus, Plus, Sparkle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";

/**
 * Ana sayfadaki SSS özeti — ilk beş soru.
 *
 * Ziyaretçinin en çok takıldığı yerler (fiyat sabit mi, rehber Arapça mı,
 * karşılama nasıl) ana sayfada cevaplanınca WhatsApp'a yazmadan önceki
 * tereddüt azalıyor. Yapısal veri bilerek yok: FAQPage şeması yalnız /sss
 * sayfasında duruyor, iki yerde aynı soruları işaretlemek gereksiz.
 *
 * Paylaşılan Accordion bileşeni yerine base-ui birincilleri doğrudan
 * kullanılıyor: referanstaki satır düzeni (altın sıra numarası, dikey
 * ayırıcı, sağda artı işareti) o bileşenin sabit chevron'una sığmıyordu.
 */
export async function FaqPreview() {
  const t = await getTranslations("faq");
  const tEyebrow = await getTranslations("eyebrow");

  const items = (["1", "2", "3", "4", "5"] as const).map((n) => ({
    question: t(`q${n}`),
    answer: t(`a${n}`),
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("faq")}
        eyebrowIcon={<Sparkle className="size-4" aria-hidden="true" />}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link href="/faq">
            <SectionAction>
              {t("allQuestions")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </SectionAction>
          </Link>
        }
      />

      <AccordionPrimitive.Root className="flex flex-col gap-3">
        {items.map((item, index) => (
          <AccordionPrimitive.Item
            key={item.question}
            value={`home-faq-${index}`}
            className="overflow-hidden border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--hairline)",
              borderRadius: "0.9rem",
              boxShadow: "var(--shadow-e1)",
            }}
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="group/faq flex w-full items-center gap-5 px-5 py-6 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-6">
                <span
                  className="w-9 shrink-0 font-display text-[22px] font-semibold leading-none tabular-nums"
                  style={{ color: "color-mix(in oklab, var(--brand-gold-deep) 70%, transparent)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className="h-6 w-px shrink-0"
                  style={{ background: "color-mix(in oklab, var(--brand-night) 14%, transparent)" }}
                />

                <span className="flex-1 text-[15.5px] font-bold leading-snug">{item.question}</span>

                <Plus
                  className="size-5 shrink-0 group-aria-expanded/faq:hidden"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
                <Minus
                  className="hidden size-5 shrink-0 group-aria-expanded/faq:block"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            <AccordionPrimitive.Panel className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down">
              <div className="h-(--accordion-panel-height) ps-[4.75rem] pe-6 pb-5 text-[14px] leading-[1.85] text-muted-foreground data-ending-style:h-0 data-starting-style:h-0">
                {item.answer}
              </div>
            </AccordionPrimitive.Panel>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </section>
  );
}
