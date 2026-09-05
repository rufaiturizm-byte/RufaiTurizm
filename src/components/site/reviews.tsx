import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { reviews, ratingBreakdown } from "@/data/reviews";
import { siteConfig } from "@/config/site";
import { isRtl } from "@/i18n/routing";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <Star
          key={index}
          className="size-[15px]"
          style={{ fill: "var(--brand-gold)", color: "var(--brand-gold)" }}
        />
      ))}
    </div>
  );
}

/**
 * Puan kırılımlı müşteri yorumları (rakip analizi, madde 9).
 *
 * `src/data/reviews.ts` boş olduğu sürece hiç render edilmez — uydurma
 * isim/tarihle yorum yayınlamıyoruz. Yorum metni çevrilmez, müşterinin
 * yazdığı dilde ve kendi yön (dir) değeriyle basılır.
 */
export async function Reviews() {
  if (reviews.length === 0) return null;

  const t = await getTranslations("reviews");

  const average =
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;

  return (
    <section style={{ background: "var(--brand-night)" }}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="mb-9 text-center text-[26px] font-bold text-white sm:text-[30px]">
          {t("title")} <span style={{ color: "var(--brand-gold)" }}>{t("titleAccent")}</span>
        </h2>

        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <div
            className="flex flex-col gap-4 rounded-xl p-6"
            style={{ background: "var(--brand-night-2)" }}
          >
            <div>
              <div className="text-[52px] font-extrabold leading-none text-white">
                {average.toFixed(1)}
              </div>
              <div className="mt-2.5">
                <Stars />
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/55">
                {reviews.length} {t("basedOn")}
              </p>
            </div>

            {ratingBreakdown.length > 0 ? (
              <div className="flex flex-col gap-3">
                {ratingBreakdown.map((row) => (
                  <div key={row.key}>
                    <div className="mb-1.5 flex justify-between text-[13px]">
                      <span className="text-white/75">{t(row.key)}</span>
                      <span className="font-bold text-white">{row.score.toFixed(1)}</span>
                    </div>
                    <div className="h-1 rounded-sm bg-white/15">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${(row.score / 5) * 100}%`,
                          background: "var(--brand-gold)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {siteConfig.googleReviewsUrl ? (
              <a
                href={siteConfig.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border py-3 text-center text-[13px] font-bold text-white transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--brand-night-3)" }}
              >
                {t("googleCta")}
              </a>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={`${review.name}-${review.date}`}
                className="flex flex-col gap-2.5 rounded-xl bg-white p-5"
              >
                <figcaption>
                  <div className="text-[14px] font-bold">{review.name}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">
                    {review.country} ·{" "}
                    {new Date(review.date).toLocaleDateString(review.lang)}
                  </div>
                </figcaption>
                <Stars count={review.rating} />
                <blockquote
                  dir={isRtl(review.lang) ? "rtl" : "ltr"}
                  className="text-[13.5px] leading-[1.8] text-foreground/80"
                >
                  {review.text}
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
