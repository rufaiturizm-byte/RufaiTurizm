"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { siteConfig } from "@/config/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 — geliştirmede kapalı.
 *
 * `next dev` altında hiç yüklenmiyor. Sebebi somut: geliştirirken sayfalar
 * defalarca açılıyor ve o trafik ölçüme karışırsa "kaç kişi WhatsApp'a
 * tıkladı" gibi küçük sayılar işe yaramaz hale geliyor.
 *
 * Kontrol `NODE_ENV` üzerinden, yani DERLEME anında: koşul sabite
 * dönüşüyor, tarayıcıda state ya da efekt gerekmiyor ve sunucuyla
 * istemcinin bastığı HTML aynı kalıyor (hidrasyon uyuşmazlığı yok).
 *
 * DÜRÜST SINIR: bu kontrol `next dev`i ayırır, yerel `next start`i
 * ayırmaz — o da üretim derlemesidir. Yerelde üretim derlemesi açıp
 * gezmek GA'ya veri yazar. Önizleme dağıtımlarını da ayırmak isterseniz
 * doğru yol ölçüm kimliğini `NEXT_PUBLIC_GA_ID` env değişkenine almak
 * ve Vercel'de yalnız Production ortamına tanımlamak.
 */
export function Ga4() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      {/*
        `@next/third-parties`'in GoogleAnalytics bileşeni KULLANILMIYOR.

        O bileşen script'i `afterInteractive` ile yüklüyor, yani hidrasyon
        sırasında. Google'ın kendi PageSpeed testi (mobil, kısıtlı bağlantı)
        bunun bedelini gösterdi: gtag.js 173 KB ve sayfanın EN BÜYÜK
        script'i — uygulamanın kendi en büyük parçası 72 KB. Toplam
        aktarımın %15'i ve %40'ı hiç kullanılmıyor.

        `lazyOnload` script'i `load` olayından sonraya alıyor: sayfa
        kendi JS'iyle yarışmayı bitirdikten sonra iniyor.

        TAKAS AÇIK OLSUN: ölçüm birkaç yüz milisaniye geç başlıyor. Sayfayı
        açıp hemen kapatan çok hızlı bir ziyaretçi sayılmayabilir, yani
        hemen çıkma oranı bir miktar eksik ölçülür. Buna karşılık bu sitede
        asıl ölçülen şey WhatsApp tıklaması ve o zaten etkileşimden SONRA
        oluyor — script o noktada çoktan yüklü.

        İçerik, paketin ürettiğinin aynısı (kaynağı okundu): dataLayer
        kurulumu + config, sonra gtag.js.
      */}
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${siteConfig.ga4Id}');`}
      </Script>
      <Script
        id="ga4-src"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`}
      />
      <SayfaGoruntuleme />
    </>
  );
}

/**
 * Sayfa geçişlerini GA4'e bildirir.
 *
 * BU OLMADAN ÖLÇÜM YANLIŞ OLUR. `@next/third-parties` kaynağına bakıldı:
 * yalnız bir kez `gtag('config', ...)` çağırıyor, yani sayfa görüntüleme
 * SADECE ilk yüklemede gönderiliyor. Oysa bu bir App Router sitesi ve
 * menüden, karttan, altbilgiden yapılan her geçiş istemci tarafında
 * oluyor — tarayıcı yeni sayfa yüklemiyor.
 *
 * Sonuç, düzeltilmeseydi şu olurdu: ana sayfaya girip beş tur sayfası
 * gezen bir ziyaretçi GA4'te TEK sayfa görüntüleme sayılırdı. Oturum
 * başına sayfa, en çok görüntülenen sayfalar, çıkış sayfaları — hepsi
 * yanlış çıkardı ve yanlış oldukları anlaşılmazdı.
 *
 * İlk çalışma atlanıyor: `config` zaten bir `page_view` gönderdi, burada
 * ikinci kez göndermek ilk sayfayı iki kez saymak olurdu.
 *
 * `useSearchParams` bilerek kullanılmıyor — App Router'da onu okumak
 * sayfayı Suspense sınırına zorluyor ve statik üretimi bozuyor. Sorgu
 * dizesi doğrudan `window.location` üzerinden alınıyor.
 */
function SayfaGoruntuleme() {
  const yol = usePathname();
  const ilk = useRef(true);

  useEffect(() => {
    if (ilk.current) {
      ilk.current = false;
      return;
    }
    window.gtag?.("event", "page_view", {
      page_path: yol + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [yol]);

  return null;
}

/**
 * WhatsApp tıklamalarını GA4'e "lead" olarak gönderir.
 *
 * NEDEN TEK DİNLEYİCİ. Sitede binlerce WhatsApp bağlantısı var ve
 * hepsinde zaten `data-analytics` özniteliği duruyor (`whatsapp-cta`,
 * `whatsapp-floating`, `whatsapp-transfer-form`, `whatsapp-mobile-bar`).
 * Her bileşene ayrı `onClick` eklemek hem binlerce yerde tekrar olurdu
 * hem de yeni bir çağrı eklendiğinde unutulacak ilk şey o olurdu.
 * Belgeye tek bir yakalama aşamalı dinleyici koymak hepsini kapsıyor.
 *
 * NEDEN `generate_lead`. GA4'ün kendi önerdiği olay adı ve arayüzde
 * "anahtar olay" (dönüşüm) olarak işaretlenebiliyor. Uydurma bir ad
 * (`whatsapp_click` gibi) da çalışırdı ama GA4'ün hazır dönüşüm
 * raporlarına girmezdi.
 *
 * `cta_location` parametresi hangi çağrının çalıştığını söylüyor —
 * sayfanın üstündeki buton mu, mobil çubuk mu, form mu. Dönüşümün
 * nereden geldiğini bilmeden hangi çağrıyı iyileştireceğin belli olmaz.
 * Parametre adı bilerek `source` DEĞİL: o GA4'te trafik kaynağı için
 * ayrılmış bir ad ve kendi değerimizle çakışırdı.
 */
export function WhatsAppEvents() {
  useEffect(() => {
    const tikla = (olay: MouseEvent) => {
      const hedef = olay.target;
      if (!(hedef instanceof Element)) return;

      /*
       * E-posta da bir iletişim yolu.
       *
       * `mailto:` bağlantılarında `data-analytics` yok (altbilgi ve
       * iletişim sayfasında duruyorlar) ama aynı soruyu cevaplıyorlar:
       * kaç kişi bize ulaşmaya çalıştı. Ayrı bir olay adı yerine aynı
       * `generate_lead` altında `method` ile ayrılıyorlar — böylece
       * GA4'te tek bir dönüşüm rakamı var ve kırılımı parametre veriyor.
       */
      const posta = hedef.closest<HTMLAnchorElement>('a[href^="mailto:"]');
      if (posta) {
        window.gtag?.("event", "generate_lead", {
          method: "email",
          cta_location: posta.closest("footer") ? "footer" : "page",
          page_path: window.location.pathname,
        });
        return;
      }

      const oge = hedef.closest<HTMLElement>("[data-analytics]");
      if (!oge) return;

      const kaynak = oge.dataset.analytics ?? "";
      if (!kaynak.startsWith("whatsapp")) return;

      /*
       * href YOKSA olay gönderilmiyor.
       *
       * Transfer formunun gönder düğmesi, form dolmadan `href` taşımıyor
       * ve tıklama WhatsApp'ı açmak yerine eksik alana odaklanıyor.
       * Onu "lead" saymak, gerçekleşmemiş bir dönüşümü saymak olurdu —
       * ve o düğme sayfanın en çok tıklanan yeri olduğu için rakamı
       * ciddi biçimde şişirirdi.
       */
      if (!oge.getAttribute("href")) return;

      window.gtag?.("event", "generate_lead", {
        method: "whatsapp",
        cta_location: kaynak,
        page_path: window.location.pathname,
      });
    };

    /* Yakalama aşaması: bazı çağrılarda tıklama iç öğede durduruluyor. */
    document.addEventListener("click", tikla, { capture: true });
    return () => document.removeEventListener("click", tikla, { capture: true });
  }, []);

  return null;
}
