import { getTranslations } from "next-intl/server";
import { BadgeCheck, Clock, Languages, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";

/** Ortadoğu'dan gelen misafirin en çok tereddüt ettiği dört başlık. */
export async function WhyUs({ subtitle }: { subtitle?: string }) {
  const t = await getTranslations("whyUs");

  const reasons = [
    { icon: Languages, key: "arabicSupport" },
    { icon: BadgeCheck, key: "fixedPrice" },
    { icon: Users, key: "family" },
    { icon: Clock, key: "support" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("title")} subtitle={subtitle} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, key }) => (
          <div key={key} className="rounded-lg border bg-card p-6">
            <Icon
              className="size-7"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <h3 className="mt-4 text-[15.5px] font-bold">{t(`${key}.title`)}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              {t(`${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
