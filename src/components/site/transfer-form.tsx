"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Car,
  Check,
  Crown,
  Headphones,
  Lock,
  MapPin,
  Plane,
  Plus,
  TicketPercent,
  Users,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { WhatsAppIcon } from "./icons";
import { buildWhatsAppUrl } from "./whatsapp-cta";
import { siteConfig } from "@/config/site";

type Tab = "transfer" | "chauffeur";
type ReturnKind = "none" | "same" | "different";

const FIELD =
  "w-full rounded-[0.7rem] border bg-background px-4 py-3.5 text-[14.5px] outline-none " +
  "placeholder:text-muted-foreground/65 transition-colors focus:border-[color:var(--brand-gold-deep)]";

const LABEL =
  "mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground";

/**
 * Havalimanı transferi rezervasyon formu.
 *
 * Arkasında rezervasyon altyapısı yok ve olması da gerekmiyor: tüm dönüşüm
 * WhatsApp'tan olduğu için form, seçimleri hazır bir mesaja çevirip sohbeti
 * başlatır. Rakip (cabistanbul) bunu "ARA" düğmesiyle yapıyor; bizde düğme
 * doğrudan WhatsApp'a gidiyor, böylece müşteri arada boş bir sonuç sayfası
 * görmüyor (rakip analizi, madde 10).
 *
 * Alt şeritteki dört söz ayırıcı çizgilerle bölünüyor: form doldurup
 * göndermeden hemen önceki son tereddüdü orada karşılıyoruz.
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

  /*
   * Alış ve varış noktası olmadan WhatsApp'a gitmek iki tarafı da
   * yoruyordu: müşteri "merhaba" yazıp bekliyor, ekip nereden nereye
   * gidileceğini sormak için ikinci bir mesaj yazıyordu. İki alan
   * doluysa konuşma zaten hazır bilgiyle başlıyor.
   *
   * Diğer alanlar (tarih, kişi) zorunlu değil: bilmeyen biri de yazabilmeli.
   */
  const ready = from.trim().length > 0 && to.trim().length > 0;
  const [touched, setTouched] = useState(false);
  const showError = touched && !ready;

  const tabs = [
    { key: "transfer" as const, icon: Plane, label: t("tabTransfer") },
    { key: "chauffeur" as const, icon: Car, label: t("tabChauffeur") },
  ];

  const promises = [
    { icon: Lock, label: t("trust1") },
    { icon: Crown, label: t("trust2") },
    { icon: Users, label: t("trust3") },
    { icon: Headphones, label: t("trust4") },
  ];

  return (
    <div
      className="relative overflow-hidden border p-6 sm:p-8"
      style={{
        background: "var(--surface)",
        borderColor: "var(--hairline)",
        borderRadius: "1.6rem",
        boxShadow: "var(--shadow-e4)",
      }}
    >
      {/* Kartın kenarında dolaşan ışık — sayfanın tek etkileşimli alanı,
          göz oraya gitsin diye. */}
      <BorderBeam
        size={190}
        duration={9}
        borderWidth={1.5}
        colorFrom="var(--brand-gold)"
        colorTo="color-mix(in oklab, var(--brand-gold) 20%, transparent)"
      />

      <div className="mb-7 flex flex-wrap gap-3">
        {tabs.map(({ key, icon: Icon, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={active}
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[12.5px] font-bold tracking-[0.04em] transition-colors"
              style={
                active
                  ? {
                      background: "var(--brand-gold)",
                      color: "var(--brand-night)",
                      boxShadow: "var(--shadow-e1)",
                    }
                  : {
                      border: "1px solid color-mix(in oklab, var(--brand-night) 14%, transparent)",
                      color: "var(--muted-foreground)",
                    }
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1.05fr_1fr_0.8fr]">
        <div>
          <label className={LABEL} htmlFor="tf-from">
            <MapPin className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            {t("from")}
          </label>
          <div className="flex gap-2.5">
            <input
              id="tf-from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder={t("placeholder")}
              aria-invalid={showError && !from.trim() ? true : undefined}
              className={FIELD}
              style={
                showError && !from.trim() ? { borderColor: "var(--destructive)" } : undefined
              }
            />
            {stop === null ? (
              <button
                type="button"
                onClick={() => setStop("")}
                className="inline-flex shrink-0 items-center gap-2 rounded-[0.7rem] border px-4 text-[12.5px] font-semibold transition-colors hover:bg-secondary"
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
            <MapPin className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
            {t("to")}
          </label>
          <input
            id="tf-to"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder={t("placeholder")}
            aria-invalid={showError && !to.trim() ? true : undefined}
            className={FIELD}
            style={showError && !to.trim() ? { borderColor: "var(--destructive)" } : undefined}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="tf-date">
            <CalendarDays className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
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
            <Users className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
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
                {value} {t("peopleUnit")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <a
        href={ready ? href : undefined}
        target={ready ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-disabled={!ready}
        onClick={(event) => {
          if (ready) return;
          event.preventDefault();
          setTouched(true);
          document.getElementById("tf-from")?.focus();
        }}
        data-analytics="whatsapp-transfer-form"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-[0.85rem] py-4.5 text-[16px] font-bold text-white transition-all"
        style={{
          background: "var(--brand-wa)",
          boxShadow: "var(--shadow-e2)",
          opacity: ready ? 1 : 0.55,
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        <WhatsAppIcon className="size-[22px]" />
        {t("submit")}
      </a>

      <p
        className="mt-3 text-[13px]"
        role={showError ? "alert" : undefined}
        style={{ color: showError ? "var(--destructive)" : "var(--muted-foreground)" }}
      >
        {showError ? t("required") : t("fillHint")}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(["same", "different"] as const).map((kind) => {
          const active = returnKind === kind;
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={active}
              onClick={() => setReturnKind(active ? "none" : kind)}
              className="inline-flex items-center gap-2.5 rounded-[0.7rem] border px-4 py-3 text-[13.5px] font-medium transition-colors hover:bg-secondary"
              style={active ? { borderColor: "var(--brand-gold-deep)" } : undefined}
            >
              <span
                className="flex size-[18px] items-center justify-center rounded-[4px] border"
                style={
                  active
                    ? { background: "var(--brand-gold)", borderColor: "var(--brand-gold)" }
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
          className="inline-flex items-center gap-2 rounded-[0.7rem] border px-4 py-3 text-[13.5px] font-bold"
          style={{
            background: "color-mix(in oklab, var(--brand-gold) 18%, transparent)",
            borderColor: "color-mix(in oklab, var(--brand-gold) 48%, transparent)",
            color: "var(--brand-gold-deep)",
          }}
        >
          <TicketPercent className="size-4" aria-hidden="true" />
          {t("discount")}
        </span>
      </div>

      <div
        className="mt-6 grid gap-y-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4"
        style={{ borderColor: "var(--hairline)" }}
      >
        {promises.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center justify-center gap-2.5 px-2 text-[12.5px] text-muted-foreground lg:not-first:border-s"
            style={{ borderColor: "var(--hairline)" }}
          >
            <Icon
              className="size-4 shrink-0"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
