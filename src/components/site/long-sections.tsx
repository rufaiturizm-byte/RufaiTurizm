import { headingId } from "@/lib/heading-id";
import type { Locale } from "@/i18n/routing";

type Text = { tr: string; ar: string; en: string };

/**
 * Uzun bölümler — veri dosyasından gelen hâli.
 *
 * ServiceSections aynı düzeni mesaj dosyalarından okuyor (hizmet ve tur
 * sayfaları metinlerini oradan alıyor). Paketler ise metinlerini kendi
 * veri dosyasında taşıyor, o yüzden ikinci bir giriş noktası gerekti;
 * çizim tarafı bilerek aynı: iki sütun, yapışkan başlık, `\n\n` ile
 * ayrılan paragraflar.
 *
 * Bölüm yoksa hiç render edilmiyor.
 */
export function LongSections({
  sections,
  locale,
  contentsLabel,
}: {
  sections?: { heading: Text; body: Text }[];
  locale: string;
  /** Bölüm dizini başlığı; verilmezse dizin çıkmaz. */
  contentsLabel?: string;
}) {
  if (!sections || sections.length === 0) return null;
  const lang = locale as Locale;
  const metin = (t: Text) => t[lang] ?? t.tr;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-4 sm:px-8">
      {/* Dizin yalnız ikiden fazla bölümde işe yarıyor; iki başlık için
          çip sırası kurmak sayfaya gürültüden başka bir şey katmıyor. */}
      {contentsLabel && sections.length > 2 ? (
        <nav aria-label={contentsLabel} className="mb-12">
          <p className="eyebrow-rule text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            {contentsLabel}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {sections.map((bolum, index) => (
              <li key={metin(bolum.heading)}>
                <a
                  href={`#${headingId(metin(bolum.heading), index)}`}
                  className="accent-card inline-flex px-4 py-2 text-[13.5px] font-semibold transition-colors hover:text-[color:var(--brand-gold-deep)]"
                >
                  {metin(bolum.heading)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="flex flex-col gap-14">
        {sections.map((bolum, index) => (
          <article
            key={metin(bolum.heading)}
            className="reveal-rise grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14"
          >
            <h2
              id={headingId(metin(bolum.heading), index)}
              className="font-display text-[24px] font-semibold leading-snug scroll-mt-28 sm:text-[28px] lg:sticky lg:top-28 lg:self-start"
            >
              {metin(bolum.heading)}
            </h2>
            <div className="measure flex flex-col gap-4 text-[15.5px] leading-[1.95] text-foreground/85">
              {metin(bolum.body)
                .split("\n\n")
                .map((paragraf, sira) => (
                  <p key={sira}>{paragraf}</p>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
