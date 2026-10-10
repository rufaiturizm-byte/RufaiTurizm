import { getTranslations } from "next-intl/server";
import { PageHero } from "./page-hero";
import { PageClosing } from "./page-closing";
import { ProseSection } from "./prose-section";
import { legalDocByKey, type LegalDoc } from "@/data/legal";
import type { Locale } from "@/i18n/routing";

/**
 * Yasal metin sayfası — gizlilik ve kullanım şartları aynı düzeni paylaşıyor.
 *
 * Bölümler `ProseSection` ile basılıyor, yani sitenin geri kalanıyla aynı
 * tipografi. Yasal sayfaları ayrı bir "küçük gri yazı" düzenine sokmak
 * yaygın ama yanlış: okunmasını istemediğin metin, okunmaması için
 * tasarlanmış gibi görünür.
 *
 * Kapak fotoğrafı bilerek sade bir şehir karesi; burada satış yok.
 */
export async function LegalDocPage({
  docKey,
  locale,
}: {
  docKey: LegalDoc["key"];
  locale: string;
}) {
  const doc = legalDocByKey(docKey);
  const lang = locale as Locale;
  const text = (value: { tr: string; ar: string; en: string }) => value[lang] ?? value.tr;

  const tNav = await getTranslations("nav");
  const t = await getTranslations("legal");

  const title = text(doc.title);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <PageHero
        image="/images/places/galata.jpg"
        imageAlt={title}
        crumbs={[{ label: tNav("home"), href: "/" }, { label: title }]}
        title={title}
        subtitle={text(doc.intro)}
      />

      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="text-[12.5px] text-muted-foreground">
            {t("updated", { date: doc.updated })}
          </p>

          <div className="mt-8 flex flex-col gap-12">
            {doc.sections.map((section, i) => (
              <ProseSection
                key={section.heading.tr}
                title={text(section.heading)}
                body={text(section.body)}
                index={i}
                scale="run"
              />
            ))}
          </div>

          {/*
            Metnin taslak olduğu SAYFADA yazıyor.

            Hukuk metni yazmak avukatın işi. Buradaki metin sitenin ne
            yaptığını doğru anlatıyor — kodda ölçüldü — ama hukuki
            denetimden geçmedi. Bunu ziyaretçiden saklamak, metnin
            kendisinin iddia ettiği dürüstlüğe ters düşerdi.
          */}
          <p
            className="mt-12 border-s-2 ps-4 text-[13px] leading-[1.8] text-muted-foreground"
            style={{ borderColor: "var(--brand-gold)" }}
          >
            {t("draftNote")}
          </p>
        </div>
      </section>

      <PageClosing locale={locale} />
    </main>
  );
}
