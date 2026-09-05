import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type Crumb = {
  label: string;
  /** Son kırıntı bağlantısız kalır: bulunduğunuz sayfaya link verilmez. */
  href?: "/" | "/transfer" | "/tours" | "/services" | "/hotels" | "/guides" | "/about" | "/faq" | "/contact";
};

/**
 * Kırıntı yolu.
 *
 * Sayfa başlıklarının üstünde "Ana Sayfa · Transfer" yazıyordu ama düz
 * metindi: ziyaretçi bölüme geri dönmek için tarayıcının geri düğmesine ya
 * da menüye gitmek zorundaydı. Derin sayfalarda (tur detayı, güzergâh,
 * rehber yazısı) bu gerçek bir çıkmaz.
 *
 * Yapısal veri (BreadcrumbList) zaten vardı; eksik olan görünen taraftı.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronLeft
                  className="size-3.5 rotate-180 text-white/35 rtl:rotate-0"
                  aria-hidden="true"
                />
              ) : null}

              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-white/85" : "text-white/60"} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
