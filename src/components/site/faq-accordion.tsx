import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Minus, Plus } from "lucide-react";

/**
 * Numaralı SSS satırları.
 *
 * Düzen ana sayfada kuruluydu ama /sss sayfası hâlâ paylaşılan sade
 * akordeonu kullanıyordu: aynı sitede iki farklı soru-cevap görünümü vardı.
 * Buraya çıkarıldı, ikisi de aynı satırı basıyor.
 *
 * Paylaşılan `ui/accordion` yerine base-ui birincilleri doğrudan
 * kullanılıyor: altın sıra numarası, dikey ayırıcı ve sağdaki artı işareti
 * o bileşenin sabit chevron'una sığmıyor.
 */
export function FaqAccordion({
  items,
  startAt = 1,
}: {
  items: { question: string; answer: string }[];
  /** İlk satırın numarası — bölünmüş listelerde 6'dan devam edebilsin diye. */
  startAt?: number;
}) {
  return (
    /*
     * hiddenUntilFound: base-ui akordeon panelleri varsayılan olarak yalnız
     * AÇILDIKLARINDA DOM'a giriyor. Yani sunucudan gelen HTML'de on iki soru
     * vardı ama TEK BİR CEVAP YOKTU: sayfanın kendisi 182 kelimeydi, arama
     * motoru ve JavaScript'siz kullanıcı cevapları hiç görmüyordu.
     *
     * `hidden="until-found"` içeriği DOM'da tutar, kapalıyken gizler ve
     * tarayıcının sayfa içi aramasında bulunduğunda bölümü kendiliğinden
     * açar — hem erişilebilirlik hem SEO için doğru olan bu.
     */
    <AccordionPrimitive.Root hiddenUntilFound className="flex flex-col gap-3">
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={item.question}
          value={`faq-${startAt + index}`}
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
                {String(startAt + index).padStart(2, "0")}
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
  );
}
