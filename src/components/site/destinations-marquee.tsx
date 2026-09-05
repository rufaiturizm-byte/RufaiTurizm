import { getTranslations } from "next-intl/server";
import { Grid3x3, MapPinned } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

/**
 * Destinasyon şeridi.
 *
 * Turlar ile "Neden biz" bölümü arasında koyu bir kesit: kaydıkça geçen
 * şehir adları hem hizmet kapsamını gösteriyor hem de art arda gelen iki
 * açık zeminli bölümü ayırıyor. İki uçtaki simge kutuları şeridi kadraja
 * oturtuyor — yoksa yazılar ekranın kenarında kesilmiş gibi duruyordu.
 *
 * Sunucuda basılıyor, kaydırma saf CSS animasyonu.
 */
export async function DestinationsMarquee() {
  const t = await getTranslations("transferPage");
  const cities = t.raw("cities") as string[];

  return (
    <section
      className="overflow-hidden border-y"
      style={{
        background: "var(--brand-night)",
        borderColor: "color-mix(in oklab, white 8%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-6 sm:px-8">
        <span className="icon-tile size-11 shrink-0" aria-hidden="true">
          <MapPinned className="size-5" />
        </span>

        <div className="marquee-fade min-w-0 flex-1 overflow-hidden" aria-hidden="true">
          <Marquee pauseOnHover className="[--duration:42s] [--gap:0px]">
            {cities.map((city) => (
              <span key={city} className="flex items-center">
                <span className="font-display text-[19px] font-medium whitespace-nowrap text-white/78 sm:text-[21px]">
                  {city}
                </span>
                <span
                  className="mx-8 size-1 shrink-0 rounded-full"
                  style={{ background: "color-mix(in oklab, var(--brand-gold) 70%, transparent)" }}
                />
              </span>
            ))}
          </Marquee>
        </div>

        <span className="icon-tile size-11 shrink-0" aria-hidden="true">
          <Grid3x3 className="size-5" />
        </span>
      </div>
    </section>
  );
}
