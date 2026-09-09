"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = { ar: "AR", tr: "TR", en: "EN" };

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-0.5 rounded-md p-0.5"
      style={{ background: "var(--brand-night-2)" }}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace({ pathname, params } as never, { locale: l })}
          aria-current={l === locale ? "true" : undefined}
          /*
            px-2 en dar ekranlar için; 360 pikselden itibaren eski hali.
            Yükseklik ayrı veriliyor: py-1 ile düğmeler 26 piksel kalıyordu
            ve üçü yan yana durduğu için mobilde yanlış dokunma kolaydı.
            WCAG 2.2 AA eşiğinin (24 piksel) üstündeydi, yani kusur değil —
            ama menü düğmesi 40 piksel ve başlık çubuğu 76; yer vardı.
            min-h ile 38'e çıkıyor, genişlik ve yazı boyutu değişmiyor.
          */
          className="inline-flex min-h-[38px] items-center justify-center rounded px-2 py-1 text-[12px] font-semibold transition-colors min-[360px]:px-2.5"
          style={
            l === locale
              ? { background: "var(--brand-gold)", color: "var(--brand-night)" }
              : { color: "rgba(255,255,255,0.55)" }
          }
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
