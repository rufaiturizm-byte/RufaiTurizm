import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { guideBySlug } from "@/data/guides";
import type { Locale } from "@/i18n/routing";

/**
 * Sayfa konusuyla ilgili tek bir rehbere bağlamsal bağ.
 *
 * NEDEN VAR. Yazılan yeni rehberler sitedeki en az iç bağlantı alan
 * sayfalardı: bütçe rehberine 2, para ve SIM rehberlerine 3 bağlantı
 * geliyordu, site ortalaması 24,5. Sebep basit — eski rehberler bölge
 * ve tur sayfalarından da bağ alıyor (`guideSlugs`, `guideSlug`), ama
 * "para", "bütçe", "otel seçimi" gibi PRATİK konuların bağlamsal bir
 * evi yoktu; yalnız rehber listesinden ve birbirlerinden bağ
 * alıyorlardı.
 *
 * Bu bileşen o boşluğu kapatıyor: otel sayfası otel seçme rehberine,
 * paketler sayfası bütçe rehberine bağlanıyor. Bağ hem arama motoru
 * için hem de gerçekten o soruyu soran ziyaretçi için doğru yerde.
 *
 * Rehber bulunamazsa hiçbir şey basmıyor — veri eksikse sayfa
 * bozulmasın.
 */
export async function GuideLink({
  slug,
  locale,
  eyebrow,
}: {
  slug: string;
  locale: string;
  /** Üstteki küçük etiket; verilmezse "Seyahat Rehberi". */
  eyebrow?: string;
}) {
  const guide = guideBySlug(slug);
  if (!guide) return null;

  const tNav = await getTranslations("nav");
  const tGuides = await getTranslations("guidesPage");
  const lang = locale as Locale;
  const title = guide.title[lang] ?? guide.title.tr;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <Link
        href={{ pathname: "/guides/[slug]", params: { slug } }}
        className="group grid overflow-hidden sm:grid-cols-[minmax(0,1fr)_34%]"
        style={{
          borderRadius: "var(--radius-card)",
          background: "var(--surface)",
          boxShadow: "var(--edge-light), var(--shadow-e2)",
        }}
      >
        <div className="flex flex-col justify-center p-7 sm:p-9">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            {eyebrow ?? tNav("guides")}
          </span>
          <h2 className="mt-2.5 measure font-display text-[22px] font-semibold leading-snug sm:text-[26px]">
            {title}
          </h2>
          <p className="mt-3 measure text-[14.5px] leading-[1.8] text-muted-foreground">
            {guide.excerpt[lang] ?? guide.excerpt.tr}
          </p>
          <span
            className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            {tGuides("readCta")}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Görsel mobilde gizli: dar ekranda kart yükseklik kazanıyor ama
            hiçbir şey anlatmıyor, metin ekranın altına iniyordu. */}
        <div className="relative hidden min-h-[180px] sm:block">
          <Image
            src={guide.image}
            alt=""
            fill
            sizes="34vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </section>
  );
}
