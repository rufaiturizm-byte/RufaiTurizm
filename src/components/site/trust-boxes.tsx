import { getTranslations } from "next-intl/server";
import { PlaneLanding, BadgeCheck, MessagesSquare, Languages } from "lucide-react";

/**
 * Transfer formunun altındaki dört güven kutusu (rakip analizi, madde 12).
 * Yalnızca doğrulayabildiğimiz vaatler yazılır — belge/sigorta iddiaları
 * belge numaraları girilene kadar belge bandında durur, burada değil.
 */
export async function TrustBoxes() {
  const t = await getTranslations("trustBoxes");

  const items = [
    { icon: PlaneLanding, title: t("airports"), desc: t("airportsDesc") },
    { icon: BadgeCheck, title: t("fixed"), desc: t("fixedDesc") },
    { icon: Languages, title: t("driver"), desc: t("driverDesc") },
    { icon: MessagesSquare, title: t("support"), desc: t("supportDesc") },
  ];

  return (
    <section style={{ background: "var(--brand-night)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            /* Kenarlık dizilim yönünü izler: mobilde alt, ızgarada yan taraf. */
            className="flex items-center gap-3.5 border-b px-6 py-6 last:border-0 sm:px-7 sm:not-nth-[2n]:border-e sm:nth-[n+3]:border-b-0 lg:border-b-0 lg:not-last:border-e"
            style={{ borderColor: "var(--brand-night-3)" }}
          >
            <Icon
              className="size-6 shrink-0"
              style={{ color: "var(--brand-gold)" }}
              aria-hidden="true"
            />
            <div>
              <div className="text-[14.5px] font-bold text-white">{title}</div>
              <div className="mt-1 text-[12.5px] text-white/55">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
