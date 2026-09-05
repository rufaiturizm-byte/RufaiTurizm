import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, MessageCircleQuestionMark, Sparkle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";
import { FaqAccordion } from "./faq-accordion";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";

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
  const tCta = await getTranslations("cta");

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

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <FaqAccordion items={items} />

        {/*
          Sayfanın alt üçte biri tümüyle yazıydı: SSS, kapanış ve belge bandı
          arka arkaya görselsiz geliyordu. Bu kart hem o boşluğu dolduruyor
          hem de asıl işi yapıyor — listede olmayan soruyu soracak kişiyi
          listenin yanında yakalıyor.
        */}
        <aside
          className="relative isolate overflow-hidden lg:sticky lg:top-24"
          style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
        >
          {/* Katmanlar pozitif z-index ile: negatif z-index, `isolate` ve
              `sticky` bir arada olunca fotoğraf boyanmıyordu. */}
          <Image
            src="/images/tours/istanbul.jpg"
            alt={t("stillTitle")}
            fill
            sizes="(max-width: 1024px) 100vw, 460px"
            className="absolute inset-0 z-0 object-cover object-center"
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 96%, transparent) 0%, color-mix(in oklab, var(--brand-night) 90%, transparent) 34%, color-mix(in oklab, var(--brand-night) 52%, transparent) 66%, color-mix(in oklab, var(--brand-night) 14%, transparent) 100%)",
            }}
          />

          <div className="relative z-20 flex min-h-[380px] flex-col justify-end p-7">
            <span
              className="icon-tile mb-5 size-11"
              aria-hidden="true"
            >
              <MessageCircleQuestionMark className="size-5" />
            </span>
            <h3 className="font-display text-[23px] font-semibold leading-snug text-white">
              {t("stillTitle")}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-white/72">{t("stillText")}</p>

            <WhatsAppLink
              className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
              style={{
                background: "var(--brand-gold)",
                color: "var(--brand-night)",
                boxShadow: "var(--shadow-e2)",
              }}
            >
              <WhatsAppIcon className="size-[18px]" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
