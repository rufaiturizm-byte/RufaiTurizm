import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";
import { guides } from "@/data/guides";
import type { Locale } from "@/i18n/routing";

/**
 * Ana sayfadaki rehber özeti.
 *
 * On sekiz rehber yazısı vardı ve ANA SAYFA HİÇBİRİNE LİNK VERMİYORDU:
 * yazılara yalnız menüden ya da arama motorundan ulaşılıyordu. Sitenin en
 * çok ziyaret edilen sayfası, en çok emek verilen içeriği göstermiyordu.
 *
 * Üç yazı seçiliyor, hepsi değil: ana sayfa zaten uzun ve buradaki amaç
 * bölümün varlığını duyurmak — listenin tamamı kendi sayfasında.
 */

/** Ana sayfada gösterilecek üç yazı: satın alma kararına en yakın olanlar. */
const FEATURED = [
  "istanbul-havalimanindan-sehre-ulasim",
  "istanbulda-nerede-kalinir",
  "turkiyeye-ne-zaman-gitmeli",
];

export async function GuidesTeaser({ locale }: { locale: string }) {
  const t = await getTranslations("guidesPage");
  const lang = locale as Locale;

  const featured = FEATURED.map((slug) => guides.find((g) => g.slug === slug)).filter(
    (g): g is (typeof guides)[number] => g !== undefined,
  );

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
        action={
          <Link href="/guides">
            <SectionAction>
              {t("allGuides")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </SectionAction>
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((guide) => {
          const title = guide.title[lang] ?? guide.title.tr;
          const href = {
            pathname: "/guides/[slug]" as const,
            params: { slug: guide.slug },
          };

          return (
            <article key={guide.slug} className="reveal-rise accent-card group flex flex-col overflow-hidden">
              <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={guide.image}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-black"
                  style={{ boxShadow: "var(--shadow-e1)" }}
                >
                  <Clock className="size-3" aria-hidden="true" />
                  {guide.minutes} {t("minutes")}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[18px] font-semibold leading-snug">
                  <Link
                    href={href}
                    className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {title}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                  {guide.excerpt[lang] ?? guide.excerpt.tr}
                </p>

                <Link
                  href={href}
                  className="mt-3 inline-flex py-1.5 items-center gap-2 text-[13.5px] font-bold"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  {t("readCta")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
