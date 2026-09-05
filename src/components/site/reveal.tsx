"use client";

import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

/**
 * Bölümleri görüş alanına girdikçe açar.
 *
 * Sayfa tamamen durağandı; uzun bir sayfada hiçbir şeyin kımıldamaması
 * onu basılı bir belge gibi gösteriyordu. BlurFade zaten kuruluydu ama
 * hiçbir yerde kullanılmıyordu.
 *
 * `inViewMargin` negatif: öğe ekranın altına değdiği anda değil, biraz
 * içeri girdiğinde açılsın diye. Hareketi azaltmayı seçen kullanıcıda
 * motion kütüphanesi geçişleri kendiliğinden kısaltır.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <BlurFade
      delay={delay}
      duration={0.5}
      offset={14}
      inViewMargin="-80px"
      className={className}
    >
      {children}
    </BlurFade>
  );
}
