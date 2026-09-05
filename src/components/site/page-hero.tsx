import Image from "next/image";

/**
 * İç sayfaların üst bandı: koyu zemin, üstte kırıntı yolu, altında başlık.
 * Ana sayfadaki hero ile aynı dili konuşur ama daha alçak.
 */
export function PageHero({
  image,
  imageAlt,
  breadcrumb,
  title,
  subtitle,
}: {
  image: string;
  imageAlt: string;
  breadcrumb: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative isolate">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to inline-end, color-mix(in oklab, var(--brand-night) 95%, transparent) 0%, color-mix(in oklab, var(--brand-night) 68%, transparent) 62%, color-mix(in oklab, var(--brand-night) 35%, transparent) 100%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="text-[12.5px] text-white/55">{breadcrumb}</div>
        <h1 className="mt-3 text-[32px] font-bold leading-tight text-white sm:text-[40px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-white/78">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
