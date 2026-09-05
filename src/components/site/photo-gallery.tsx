"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

/**
 * Fotoğraf şeridi — tıklanınca büyüyen.
 *
 * Araç fotoğrafları kartın içinde 4:3 kırpılmış küçük karelerdi ve
 * tıklanamıyordu: "aracın içi nasıl" sorusunu soran kişi ayrıntıyı
 * göremiyordu. `yet-another-react-lightbox` projede kuruluydu ama hiçbir
 * yerde kullanılmıyordu.
 *
 * Büyütme yalnız istendiğinde yükleniyor: lightbox bileşeni ilk tıklamaya
 * kadar hiç render edilmiyor, ilk açılışın maliyeti sayfaya binmiyor.
 */
export function PhotoGallery({
  photos,
  className = "",
  badge,
}: {
  photos: { src: string; alt: string }[];
  className?: string;
  /** İlk fotoğrafın köşesindeki etiket. */
  badge?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className={`grid gap-px sm:grid-cols-4 ${className}`} style={{ background: "var(--hairline)" }}>
        {photos.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={photo.alt}
            className={`group relative aspect-[4/3] cursor-zoom-in overflow-hidden ${
              i > 1 ? "hidden sm:block" : ""
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {i === 0 && badge ? (
              <span
                className="absolute start-3 top-3 rounded-[0.4rem] px-2.5 py-1 text-[11.5px] font-bold"
                style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
              >
                {badge}
              </span>
            ) : null}

            <span
              className="absolute end-3 bottom-3 inline-flex size-8 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ background: "color-mix(in oklab, var(--brand-night) 82%, transparent)", color: "#fff" }}
              aria-hidden="true"
            >
              <Expand className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {index !== null ? (
        <Lightbox
          open
          index={index}
          close={() => setIndex(null)}
          slides={photos.map((photo) => ({ src: photo.src, alt: photo.alt }))}
          controller={{ closeOnBackdropClick: true }}
        />
      ) : null}
    </>
  );
}
