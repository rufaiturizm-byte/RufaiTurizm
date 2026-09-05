"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CalendarDays, Check, MapPin, Plus, Users } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { buildWhatsAppUrl } from "./whatsapp-cta";
import { siteConfig } from "@/config/site";

type Tab = "transfer" | "chauffeur";
type ReturnKind = "none" | "same" | "different";

const FIELD =
  "w-full rounded-md border bg-background px-3.5 py-3 text-[14px] outline-none " +
  "placeholder:text-muted-foreground/70 focus:border-[color:var(--brand-gold-deep)]";

const LABEL =
  "mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground";

/**
 * Havalimanı transferi rezervasyon formu.
 *
 * Arkasında rezervasyon altyapısı yok ve olması da gerekmiyor: tüm dönüşüm
 * WhatsApp'tan olduğu için form, seçimleri hazır bir mesaja çevirip sohbeti
 * başlatır. Rakip (cabistanbul) bunu "ARA" düğmesiyle yapıyor; bizde düğme
 * doğrudan WhatsApp'a gidiyor, böylece müşteri arada boş bir sonuç sayfası
 * görmüyor (rakip analizi, madde 10).
 */
export function TransferForm() {
  const t = useTranslations("transferForm");
  const pathname = usePathname();

  const [tab, setTab] = useState<Tab>("transfer");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState<string | null>(null);
  const [datetime, setDatetime] = useState("");
  const [people, setPeople] = useState("2");
  const [returnKind, setReturnKind] = useState<ReturnKind>("none");

  const lines = [
    `${t("waService")}: ${tab === "transfer" ? t("tabTransfer") : t("tabChauffeur")}`,
    from && `${t("waFrom")}: ${from}`,
    stop && `${t("waStop")}: ${stop}`,
    to && `${t("waTo")}: ${to}`,
    datetime && `${t("waDate")}: ${datetime.replace("T", " ")}`,
    `${t("waPeople")}: ${people}`,
    returnKind !== "none" &&
      `${t("waReturn")}: ${returnKind === "same" ? t("returnSame") : t("returnDifferent")}`,
  ].filter(Boolean);

  const href = buildWhatsAppUrl({
    message: [t("waIntro"), ...lines].join("\n"),
    pageUrl: `${siteConfig.url}${pathname}`,
  });

  const tabClass = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-[12.5px] font-bold tracking-wide transition-colors ${
      active ? "" : "border text-muted-foreground hover:bg-secondary"
    }`;

  return (
    <div className="relative overflow-hidden surface-card p-5 shadow-xl sm:p-6">
      {/* Kartın kenarında dolaşan ışık — sayfanın tek etkileşimli alanı,
          göz oraya gitsin diye. */}
      <BorderBeam
        size={190}
        duration={9}
        borderWidth={1.5}
        colorFrom="var(--brand-gold)"
        colorTo="color-mix(in oklab, var(--brand-gold) 20%, transparent)"
      />
      <div className="mb-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setTab("transfer")}
          className={tabClass(tab === "transfer")}
          style={
            tab === "transfer"
              ? { background: "var(--brand-gold)", color: "var(--brand-night)" }
              : undefined
          }
        >
          {t("tabTransfer")}
        </button>
        <button
          type="button"
          onClick={() => setTab("chauffeur")}
          className={tabClass(tab === "chauffeur")}
          style={
            tab === "chauffeur"
              ? { background: "var(--brand-gold)", color: "var(--brand-night)" }
              : undefined
          }
        >
          {t("tabChauffeur")}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_0.95fr_0.7fr]">
        <div>
          <label className={LABEL} htmlFor="tf-from">
            {t("from")}
          </label>
          <div className="flex gap-2">
            <input
              id="tf-from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder={t("placeholder")}
              className={FIELD}
            />
            {stop === null ? (
              <button
                type="button"
                onClick={() => setStop("")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 text-[12.5px] font-semibold transition-colors hover:bg-secondary"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                {t("addStop")}
              </button>
            ) : null}
          </div>
          {stop !== null ? (
            <div className="mt-2.5 flex items-center gap-2">
              <MapPin
                className="size-4 shrink-0"
                style={{ color: "var(--brand-gold-deep)" }}
                aria-hidden="true"
              />
              <input
                value={stop}
                onChange={(event) => setStop(event.target.value)}
                placeholder={t("stop")}
                className={FIELD}
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor="tf-to">
            {t("to")}
          </label>
          <input
            id="tf-to"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder={t("placeholder")}
            className={FIELD}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="tf-date">
            <CalendarDays className="me-1.5 inline size-3.5 align-[-2px]" aria-hidden="true" />
            {t("datetime")}
          </label>
          <input
            id="tf-date"
            type="datetime-local"
            value={datetime}
            onChange={(event) => setDatetime(event.target.value)}
            className={FIELD}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="tf-people">
            <Users className="me-1.5 inline size-3.5 align-[-2px]" aria-hidden="true" />
            {t("people")}
          </label>
          <select
            id="tf-people"
            value={people}
            onChange={(event) => setPeople(event.target.value)}
            className={FIELD}
          >
            {Array.from({ length: 16 }, (_, index) => String(index + 1)).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="whatsapp-transfer-form"
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-md py-4 text-[15.5px] font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--brand-wa)" }}
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.4" />
        </svg>
        {t("submit")}
      </a>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {(["same", "different"] as const).map((kind) => {
          const active = returnKind === kind;
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={active}
              onClick={() => setReturnKind(active ? "none" : kind)}
              className="inline-flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-[13px] font-medium transition-colors hover:bg-secondary"
              style={active ? { borderColor: "var(--brand-gold-deep)" } : undefined}
            >
              <span
                className="flex size-4 items-center justify-center rounded-[3px] border"
                style={
                  active
                    ? {
                        background: "var(--brand-gold)",
                        borderColor: "var(--brand-gold)",
                      }
                    : undefined
                }
              >
                {active ? (
                  <Check
                    className="size-3"
                    style={{ color: "var(--brand-night)" }}
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              {kind === "same" ? t("returnSame") : t("returnDifferent")}
            </button>
          );
        })}
        <span
          className="inline-flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold"
          style={{
            background: "color-mix(in oklab, var(--brand-gold) 16%, transparent)",
            borderColor: "color-mix(in oklab, var(--brand-gold) 45%, transparent)",
            color: "var(--brand-gold-deep)",
          }}
        >
          <Check className="size-3.5" aria-hidden="true" />
          {t("discount")}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t pt-4 text-[12.5px] text-muted-foreground">
        {[t("trust1"), t("trust2"), t("trust3")].map((line) => (
          <span key={line} className="inline-flex items-center gap-1.5">
            <Check
              className="size-3.5"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
