"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Yumuşak kaydırma.
 *
 * Sayfa uzun ve çok bölümlü; sert kaydırma bölümler arası geçişi
 * parçalıyordu. Hareketi azaltmayı seçen kullanıcıda devre dışı kalır —
 * yumuşak kaydırma o ayarı yok sayarsa erişilebilirlik sorunu olur.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
