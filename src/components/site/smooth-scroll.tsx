"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    /** Sayfanın tek Lenis örneği — "başa dön" gibi yerler buradan kullanır. */
    __lenis?: Lenis;
  }
}

/**
 * Yumuşak kaydırma.
 *
 * Sayfa uzun ve çok bölümlü; sert kaydırma bölümler arası geçişi
 * parçalıyordu. Hareketi azaltmayı seçen kullanıcıda devre dışı kalır.
 *
 * KAYDIRMA TAKILMASI. İlk kurulumda Lenis tekerlek olaylarını sayfanın
 * tamamı için yakalıyordu ve üç yerde kaydırma tutukluyordu:
 *
 *  1. İç kaydırma alanları — tur karşılaştırma tablosu yatay kayıyor,
 *     açılır listeler dikey. Lenis olayı alıp sayfaya uygulayınca ne
 *     tablo kayıyordu ne sayfa. Çözüm: `data-lenis-prevent` taşıyan
 *     öğelerin üstünde Lenis devreye girmiyor (Lenis bunu kendi kontrol
 *     eder, bizim işimiz o niteliği doğru yerlere koymak).
 *
 *  2. Modallar — mobil menü ve fotoğraf büyütme açıldığında gövde
 *     kaydırması kilitleniyor ama Lenis çalışmaya devam ediyordu; modal
 *     kapandıktan sonra sayfa bir süre tepkisiz kalabiliyordu. Gövdenin
 *     `overflow` değeri izleniyor: kilitlendiğinde Lenis duruyor,
 *     açıldığında geri başlıyor.
 *
 *  3. `window.scrollTo({ behavior: "smooth" })` Lenis ile yarışıyordu.
 *     Örnek `window.__lenis` üzerinden paylaşılıyor ki başa dönüş
 *     animasyonu tek elden yürüsün.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    /* Modal açıkken gövde kaydırması kilitlenir; Lenis de durmalı. */
    const syncWithScrollLock = () => {
      const locked = getComputedStyle(document.body).overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };
    syncWithScrollLock();

    const observer = new MutationObserver(syncWithScrollLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
