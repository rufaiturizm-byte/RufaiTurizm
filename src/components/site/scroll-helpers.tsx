"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Okuma göstergesi — rehber ve güzergâh yazılarının üstünde ince bir çizgi.
 *
 * Yazılar 3.000–5.500 karakter; kaydırma çubuğu dışında ne kadar kaldığını
 * söyleyen bir şey yoktu. Çizgi üst çubuğun hemen altında duruyor ve
 * yalnızca ilerlemeyi gösteriyor; tıklanabilir değil, dikkat çalmıyor.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-[76px] z-40 h-0.5"
      aria-hidden="true"
      style={{ background: "color-mix(in oklab, var(--brand-night) 12%, transparent)" }}
    >
      <div
        className="h-full origin-left rtl:origin-right"
        style={{
          background: "var(--brand-gold)",
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
}

/**
 * Yukarı çık düğmesi.
 *
 * Sayfalar 4.000–8.000 piksel uzunluğunda ve altbilgiye varan ziyaretçinin
 * başa dönmek için tek yolu kaydırmaktı. Düğme iki ekran boyu aşağı
 * inildikten sonra beliriyor; yüzen WhatsApp düğmesinin üstünde ve daha
 * kısık, çünkü dönüşüm çağrısıyla yarışmamalı.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backToTop")}
      className="fixed bottom-[5.5rem] z-40 inline-flex size-11 items-center justify-center rounded-full border transition-all"
      style={{
        insetInlineEnd: "1.25rem",
        background: "color-mix(in oklab, var(--brand-night) 88%, transparent)",
        borderColor: "color-mix(in oklab, white 18%, transparent)",
        color: "#fff",
        backdropFilter: "blur(6px)",
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        transform: shown ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <ArrowUp className="size-[18px]" aria-hidden="true" />
    </button>
  );
}
