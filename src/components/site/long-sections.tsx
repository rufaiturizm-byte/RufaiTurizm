import { headingId } from "@/lib/heading-id";
import { ProseSection } from "./prose-section";
import type { Locale } from "@/i18n/routing";

type Text = { tr: string; ar: string; en: string };

/**
 * Uzun bölümler — veri dosyasından gelen hâli.
 *
 * ServiceSections aynı düzeni mesaj dosyalarından okuyor (hizmet ve tur
 * sayfaları metinlerini oradan alıyor). Paketler ise metinlerini kendi
 * veri dosyasında taşıyor, o yüzden ikinci bir giriş noktası gerekti.
 *
 * Çizim işi ProseSection'da: numaralı rozet, giriş paragrafı ve altın
 * dikey çizgi orada tanımlı ve üç yerde de aynı görünüyor. Burada kalan
 * tek şey dilden metni seçmek ve çip dizinini basmak.
 *
 * Bölüm yoksa hiç render edilmiyor.
 */
export function LongSections({
  sections,
  locale,
  contentsLabel,
}: {
  sections?: {
    heading: Text;
    body: Text;
    items?: { title: Text; body: Text }[];
    outro?: Text;
  }[];
  locale: string;
  /** Bölüm dizini başlığı; verilmezse dizin çıkmaz. */
  contentsLabel?: string;
}) {
  if (!sections || sections.length === 0) return null;
  const lang = locale as Locale;
  const metin = (t: Text) => t[lang] ?? t.tr;

  /*
    Alt boşluk pb-4 (16 piksel) idi ve iki yerde yetmiyordu: bölüm bir
    bandın son çocuğu olduğunda metin bandın alt kenarına yapışıyordu
    (paket detayında ölçtüm: 15 piksel), bir sonraki bölüm geldiğinde de
    aralarında 16 piksel kalıyordu. Sitenin standart bölüm alt boşluğu 80.
  */
  return (
    <div className="pb-20">
      {/* Dizin yalnız ikiden fazla bölümde işe yarıyor; iki başlık için
          çip sırası kurmak sayfaya gürültüden başka bir şey katmıyor. */}
      {contentsLabel && sections.length > 2 ? (
        <nav
          aria-label={contentsLabel}
          className="mx-auto mb-12 w-full max-w-7xl px-5 sm:px-8"
        >
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
          <ProseSection
            key={metin(bolum.heading)}
            title={metin(bolum.heading)}
            body={metin(bolum.body)}
            items={bolum.items?.map((madde) => ({
              title: metin(madde.title),
              body: metin(madde.body),
            }))}
            outro={bolum.outro ? metin(bolum.outro) : undefined}
            index={index}
            scale="run"
            reveal
          />
        ))}
      </div>
    </div>
  );
}
