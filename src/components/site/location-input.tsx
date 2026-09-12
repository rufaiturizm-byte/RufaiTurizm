"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Landmark, MapPin, Plane, ShoppingBag } from "lucide-react";
import { searchLocations, type LocationKind, type LocationOption } from "@/data/locations";

/**
 * Alış / varış noktası alanı — yazarken öneri gösterir.
 *
 * NEDEN. Alan boş bir metin kutusuydu ve ziyaretçi "İstanbul havalimanı"
 * mı, "IST" mi, "Istanbul Airport" mı yazacağını bilmiyordu. Yazım
 * tuttmayınca WhatsApp'a giden mesaj belirsiz kalıyor ve satışçı "hangi
 * havalimanı" diye geri sormak zorunda kalıyordu — dönüşümün en pahalı
 * yeri o geri soru.
 *
 * SERBEST METİN KORUNUYOR. Bu bir açılır liste DEĞİL: öneri seçmek zorunlu
 * değil, listede olmayan bir yer yazılabilir. Kapalı bir liste, kaydı
 * olmayan her otel için bir rezervasyon kaybı olurdu ve bu formun tek işi
 * rezervasyon.
 *
 * ERİŞİLEBİLİRLİK. WAI-ARIA'nın combobox kalıbı: alan `role="combobox"`,
 * liste `role="listbox"`, satırlar `role="option"`. Odak alanda KALIYOR,
 * satırlara geçmiyor; hangi satırın seçili olduğunu `aria-activedescendant`
 * söylüyor. Ekran okuyucu böylece hem yazılanı hem vurgulanan öneriyi
 * okuyabiliyor. Klavye: yukarı/aşağı gezer, Enter seçer, Esc kapatır.
 *
 * FARE İÇİN `onMouseDown` KULLANILIYOR, `onClick` DEĞİL. Tıklama önce
 * alandan odağı düşürüyor (blur), blur listeyi kapatıyor ve `onClick` hiç
 * çalışmıyordu. `onMouseDown` blur'dan önce koşuyor ve `preventDefault`
 * odağın düşmesini engelliyor.
 */

const IKON: Record<LocationKind, typeof MapPin> = {
  airport: Plane,
  district: MapPin,
  hotel: Building2,
  mall: ShoppingBag,
};

export function LocationInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  style,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
  style?: React.CSSProperties;
  invalid?: boolean;
}) {
  const t = useTranslations("transferForm");
  const locale = useLocale() as "tr" | "ar" | "en";
  const listId = useId();

  const [acik, setAcik] = useState(false);
  const [secili, setSecili] = useState(-1);
  const sarmalayici = useRef<HTMLDivElement>(null);

  const oneriler = useMemo(
    () => (acik ? searchLocations(value, locale) : []),
    [acik, value, locale],
  );

  /*
   * Alanın DIŞINA tıklanınca kapanır.
   *
   * Sadece blur'a bakmak yetmiyor: mobilde sayfanın boş bir yerine
   * dokunmak alandan odağı her zaman düşürmüyor ve liste açık kalıyordu.
   */
  useEffect(() => {
    if (!acik) return;
    const disariTikla = (olay: PointerEvent) => {
      if (!sarmalayici.current?.contains(olay.target as Node)) setAcik(false);
    };
    document.addEventListener("pointerdown", disariTikla);
    return () => document.removeEventListener("pointerdown", disariTikla);
  }, [acik]);

  const sec = (option: LocationOption) => {
    onChange(option.name[locale]);
    setAcik(false);
    setSecili(-1);
  };

  const tus = (olay: React.KeyboardEvent<HTMLInputElement>) => {
    if (olay.key === "Escape") {
      setAcik(false);
      return;
    }
    if (olay.key === "ArrowDown" || olay.key === "ArrowUp") {
      olay.preventDefault();
      if (!acik) {
        setAcik(true);
        return;
      }
      if (oneriler.length === 0) return;
      const yon = olay.key === "ArrowDown" ? 1 : -1;
      setSecili((onceki) => (onceki + yon + oneriler.length) % oneriler.length);
      return;
    }
    if (olay.key === "Enter" && acik && secili >= 0 && oneriler[secili]) {
      /*
       * Enter yalnız bir satır VURGULUYKEN yakalanıyor. Vurgu yokken
       * varsayılan davranış geçerli kalmalı — kullanıcı yazdığını
       * onaylayıp formu göndermek isteyebilir.
       */
      olay.preventDefault();
      sec(oneriler[secili]);
    }
  };

  const aktifId = secili >= 0 && oneriler[secili] ? `${listId}-${secili}` : undefined;

  return (
    <div ref={sarmalayici} className="relative w-full">
      <input
        id={id}
        value={value}
        onChange={(olay) => {
          onChange(olay.target.value);
          setAcik(true);
          /*
            Vurgu başa döner. Bunu bir efektle `value` değişimine bağlamak
            da olurdu ama gereksiz: değer yalnız iki yerden değişiyor —
            burası ve `sec`, o da vurguyu kendisi sıfırlıyor. Efekt, React'in
            render sonrası ikinci bir güncelleme turu demekti.
          */
          setSecili(-1);
        }}
        onFocus={() => setAcik(true)}
        onKeyDown={tus}
        placeholder={placeholder}
        className={className}
        style={style}
        aria-invalid={invalid ? true : undefined}
        role="combobox"
        aria-expanded={acik && oneriler.length > 0}
        aria-controls={acik && oneriler.length > 0 ? listId : undefined}
        aria-activedescendant={aktifId}
        aria-autocomplete="list"
        autoComplete="off"
      />

      {acik && oneriler.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("suggestionsLabel")}
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-[0.625rem] border bg-background py-1.5 shadow-lg"
        >
          {oneriler.map((option, index) => {
            const Ikon = IKON[option.kind] ?? Landmark;
            const vurgulu = index === secili;
            return (
              <li
                key={option.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={vurgulu}
                onMouseDown={(olay) => {
                  olay.preventDefault();
                  sec(option);
                }}
                onMouseEnter={() => setSecili(index)}
                className="flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-[15px] sm:text-[14px]"
                style={vurgulu ? { background: "var(--secondary)" } : undefined}
              >
                <Ikon
                  className="size-4 shrink-0"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate">{option.name[locale]}</span>
                {/*
                  Tür etiketi sessiz: aynı adı taşıyan bir semt ile bir otel
                  ayrılsın diye var, süs değil. `aria-hidden` çünkü satırın
                  kendisi zaten okunuyor ve etiket ikonla birlikte tekrar olurdu.
                */}
                <span
                  className="shrink-0 text-[11.5px] text-muted-foreground"
                  aria-hidden="true"
                >
                  {t(`kind.${option.kind}`)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
