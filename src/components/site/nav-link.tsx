"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Üst çubuk bağlantısı — bulunduğu sayfayı işaretler.
 *
 * Menüde aktif sayfa vurgusu hiç yoktu: dokuz bağlantının hepsi aynı
 * görünüyordu ve ziyaretçi sitede nerede olduğunu menüden anlayamıyordu.
 * Vurgu hem renkle hem altındaki altın çizgiyle veriliyor; rengi tek
 * başına kullanmak renk körlüğünde ayrımı kaybettiriyor.
 *
 * `aria-current="page"` ekran okuyucular için de aynı bilgiyi taşıyor.
 */
export function NavLink({
  href,
  children,
}: {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : "";
  /* Alt sayfalar da bölümü aktif sayar: /transfer/taksim-transfer
     açıkken menüdeki "Transfer" işaretli kalmalı. */
  const active =
    target === "/" ? pathname === "/" : Boolean(target) && pathname.startsWith(target);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="relative py-1 text-[14px] font-medium whitespace-nowrap transition-colors 2xl:text-[15px]"
      style={{ color: active ? "#fff" : "rgba(255,255,255,0.72)" }}
    >
      {children}
      <span
        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full transition-opacity"
        style={{
          background: "var(--brand-gold)",
          opacity: active ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </Link>
  );
}
