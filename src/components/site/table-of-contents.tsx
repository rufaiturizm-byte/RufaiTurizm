"use client";

import { useEffect, useState } from "react";

/**
 * İçindekiler — uzun yazıların kenarında sabit duran bölüm listesi.
 *
 * Rehber ve güzergâh yazıları üç-dört bölüm ve 3.000-5.500 karakter.
 * Aradığı bilgi üçüncü bölümde olan kişi (çoğu ziyaretçi tek bir soruyla
 * geliyor) onu bulmak için baştan sona kaydırmak zorundaydı.
 *
 * Okunan bölüm işaretleniyor: IntersectionObserver ile, kaydırma
 * olayına bağlanmadan — kaydırma dinleyicisi Lenis'in üstünde her karede
 * çalışırdı ve gereksiz.
 */
export function TableOfContents({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      /* Üst çubuk 76px; bölüm başlığı onun altına girdiğinde aktif sayılıyor. */
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    /* self-start şart: ızgara öğeleri varsayılan olarak satır yüksekliğine
       uzuyor ve 2000 piksel boyunda bir öğenin "yapışacak" yeri kalmıyor —
       sticky sessizce çalışmıyor gibi görünüyordu. */
    <nav aria-label={label} className="hidden self-start lg:sticky lg:top-28 lg:block">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>

      <ol className="mt-4 flex flex-col">
        {items.map((item) => {
          const on = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                className="block border-s-2 py-2.5 ps-4 text-[13.5px] leading-snug transition-colors"
                style={{
                  borderColor: on ? "var(--brand-gold)" : "var(--hairline)",
                  color: on ? "var(--foreground)" : "var(--muted-foreground)",
                  fontWeight: on ? 700 : 500,
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
