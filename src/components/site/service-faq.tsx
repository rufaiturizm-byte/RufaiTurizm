import { getTranslations } from "next-intl/server";
import { ArrowRight, MessageCircleQuestionMark } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";
import { FaqAccordion } from "./faq-accordion";
import { FaqSchema } from "./json-ld";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";
import type { ServiceKey } from "@/data/services";

/**
 * Hizmete özel soru-cevap.
 *
 * Hizmet sayfalarının altında site geneli SSS özeti duruyordu: dört sayfada
 * da aynı beş soru. Arama motoru için tekrar, ziyaretçi için ise yanlış
 * cevap — "Vito'da kaç valiz sığar" sorusu genel listede yok.
 *
 * Buradaki dört soru her hizmet için ayrı yazıldı ve /sss listesindeki on
 * ikiyle kasten çakışmıyor; genel liste kapasiteyi söylüyorsa buradaki
 * bagaj hesabını veriyor. FAQPage şeması da bu yüzden buraya konabiliyor:
 * sayfa başına tek FAQPage kalıyor, sorular sayfaya özgü.
 */
export async function ServiceFaq({ serviceKey }: { serviceKey: ServiceKey }) {
  const t = await getTranslations("services");
  const tPage = await getTranslations("servicesPage");
  const tFaq = await getTranslations("faq");
  const tCta = await getTranslations("cta");

  const items = t.raw(`${serviceKey}.faq`) as { question: string; answer: string }[];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <FaqSchema items={items} />

      <SectionHeading
        title={tPage("serviceFaqTitle")}
        subtitle={t(`${serviceKey}.title`)}
        action={
          <Link href="/faq">
            <SectionAction>
              {tFaq("allQuestions")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </SectionAction>
          </Link>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <FaqAccordion items={items} />

        <div
          className="lg:sticky lg:top-24"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <div className="p-7">
            <span className="icon-tile mb-5 size-11" aria-hidden="true">
              <MessageCircleQuestionMark className="size-5" />
            </span>
            <h3 className="font-display text-[22px] font-semibold leading-snug">
              {tFaq("stillTitle")}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-muted-foreground">
              {tFaq("stillText")}
            </p>

            <WhatsAppLink
              subject={t(`${serviceKey}.title`)}
              className="btn-wa mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-[0.625rem] px-6 py-3.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-[18px]" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
