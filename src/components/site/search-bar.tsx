"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, CalendarDays, Users, Car } from "lucide-react";
import { buildWhatsAppUrl } from "./whatsapp-cta";
import { siteConfig } from "@/config/site";
import { tours } from "@/data/tours";

type Tab = "tour" | "transfer";

/**
 * Hero arama şeridi. Klasik bir rezervasyon formu değil: seçimler
 * WhatsApp mesajını doldurur, gönder denince sohbet hazır açılır.
 */
export function SearchBar() {
  const t = useTranslations("search");
  const tTours = useTranslations("tours");
  const pathname = usePathname();

  const [tab, setTab] = useState<Tab>("tour");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");

  const tabs: { id: Tab; label: string; icon: typeof MapPin }[] = [
    { id: "tour", label: t("tabTour"), icon: MapPin },
    { id: "transfer", label: t("tabTransfer"), icon: Car },
  ];

  function submit() {
    const kind = tab === "tour" ? t("tabTour") : t("tabTransfer");
    const dest = destination ? tTours(`${destination}.name`) : t("allTours");
    const lines = [
      `${t("waIntro")} ${kind}`,
      `${t("destination")}: ${dest}`,
      `${t("date")}: ${date || "—"}`,
      `${t("people")}: ${people}`,
    ].join("\n");
    window.open(
      buildWhatsAppUrl({ message: lines, pageUrl: `${siteConfig.url}${pathname}` }),
      "_blank",
      "noopener",
    );
  }

  const fieldBase =
    "flex min-w-0 flex-1 items-center gap-2.5 px-4 py-3 text-start";

  return (
    <div className="w-full max-w-4xl">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className="flex items-center gap-2 rounded-t-lg px-5 py-2.5 text-[13px] font-semibold transition-colors"
            style={
              tab === id
                ? { background: "#fff", color: "var(--brand-night)" }
                : { background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.82)" }
            }
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-stretch rounded-lg rounded-ss-none bg-white p-2 shadow-xl sm:flex-row sm:items-center">
        <label className={fieldBase}>
          <MapPin className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-muted-foreground">{t("destination")}</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-[14.5px] font-semibold outline-none"
            >
              <option value="">{t("allTours")}</option>
              {tours.map((tour) => (
                <option key={tour.key} value={tour.key}>
                  {tTours(`${tour.key}.name`)}
                </option>
              ))}
            </select>
          </span>
        </label>

        <span className="hidden h-9 w-px bg-border sm:block" />

        <label className={fieldBase}>
          <CalendarDays className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-muted-foreground">{t("date")}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-[14.5px] font-semibold outline-none"
            />
          </span>
        </label>

        <span className="hidden h-9 w-px bg-border sm:block" />

        <label className={fieldBase}>
          <Users className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-muted-foreground">{t("people")}</span>
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-[14.5px] font-semibold outline-none"
            >
              {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </span>
        </label>

        <button
          type="button"
          onClick={submit}
          className="mt-2 shrink-0 rounded-md px-7 py-3.5 text-[14.5px] font-bold transition-opacity hover:opacity-90 sm:mt-0"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
