import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";

/**
 * "Neden biz" — editoryal düzen.
 *
 * Önceden dört eş kartlık bir ızgaraydı; sayfadaki diğer yedi ızgaradan
 * ayırt edilemiyordu. Şimdi koyu zeminde tam boy bir fotoğrafın yanında
 * numaralı liste: sayfanın ortasında ritmi kıran tek büyük an.
 */
export async function WhyUs({ subtitle }: { subtitle?: string }) {
  const t = await getTranslations("whyUs");
  const tEyebrow = await getTranslations("eyebrow");

  const reasons = ["arabicSupport", "fixedPrice", "family", "support"] as const;

  return (
    <section style={{ background: "var(--brand-night)" }}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/chauffeur.jpg"
              alt={t("arabicSupport.title")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_30%]"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow={tEyebrow("why")}
              title={t("title")}
              subtitle={subtitle}
              tone="dark"
            />

            <ol className="flex flex-col">
              {reasons.map((key, index) => (
                <li
                  key={key}
                  className="flex gap-6 py-6"
                  style={{
                    borderTop:
                      index > 0
                        ? "1px solid color-mix(in oklab, white 14%, transparent)"
                        : undefined,
                  }}
                >
                  <span
                    className="shrink-0 text-[26px] font-extrabold leading-none tabular-nums"
                    style={{ color: "color-mix(in oklab, var(--brand-gold) 55%, transparent)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-white">{t(`${key}.title`)}</h3>
                    <p className="mt-2 text-[14px] leading-[1.75] text-white/60">
                      {t(`${key}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
