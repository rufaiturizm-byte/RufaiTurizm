import { getTranslations } from "next-intl/server";
import { Marquee } from "@/components/ui/marquee";

/**
 * Destinasyon şeridi.
 *
 * İki büyük bölüm arasında nefes alanı: kaydıkça geçen şehir adları
 * hem kapsamı gösteriyor hem de sayfanın durağan ritmini kırıyor.
 * Sunucuda basılıyor, kaydırma saf CSS animasyonu.
 */
export async function DestinationsMarquee() {
  const t = await getTranslations("transferPage");
  const cities = t.raw("cities") as string[];

  return (
    <section
      className="overflow-hidden border-y py-7"
      style={{ background: "var(--brand-cream)", borderColor: "var(--hairline)" }}
      aria-hidden="true"
    >
      <Marquee pauseOnHover className="[--duration:38s] [--gap:2.75rem]">
        {cities.map((city) => (
          <span key={city} className="flex items-center gap-11">
            <span className="font-display text-[26px] font-medium text-foreground/30 sm:text-[32px]">
              {city}
            </span>
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: "var(--brand-gold-deep)" }}
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
