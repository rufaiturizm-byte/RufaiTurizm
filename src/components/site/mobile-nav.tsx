"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "./whatsapp-cta";
import { Logo } from "./logo";

type Item = { href: string; label: string };

/**
 * Küçük ekranda menü. Üst çubuktaki bağlantılar `lg` altında gizleniyor;
 * bu düğme olmadan telefondan ana sayfa dışına çıkmanın yolu yok.
 */
export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const tCta = useTranslations("cta");
  const tNav = useTranslations("nav");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={tNav("home")}
        className="inline-flex size-10 items-center justify-center rounded-[0.7rem] border text-white xl:hidden"
        style={{ borderColor: "color-mix(in oklab, white 18%, transparent)" }}
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="right"
        data-lenis-prevent
        className="border-0 overflow-y-auto p-0"
        style={{ background: "var(--brand-night)" }}
      >
        <SheetHeader className="border-b px-6 py-5" style={{ borderColor: "var(--brand-night-3)" }}>
          <SheetTitle className="text-white">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={() => setOpen(false)}
              className="border-b py-4 text-[16px] font-medium text-white/78 transition-colors hover:text-white"
              style={{ borderColor: "color-mix(in oklab, white 8%, transparent)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pt-6">
          <WhatsAppLink
            className="cta-gold flex items-center justify-center gap-2.5 px-5 py-3.5 text-[14.5px] font-bold"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            {tCta("bookNow")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
