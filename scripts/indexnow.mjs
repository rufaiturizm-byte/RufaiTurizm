/**
 * IndexNow — site haritasındaki adresleri Bing'e ve Yandex'e anında bildirir.
 *
 * NEDEN GEREKLİ. Bu sitenin 78 adresinden 77'si arama motorları için
 * "bilinmeyen" durumda. Beklemek bir strateji değil: tarayıcı yeni ve
 * otoritesi düşük alan adlarına seyrek uğruyor. IndexNow bunu tersine
 * çeviriyor — biz haber veriyoruz, keşfedilmeyi beklemiyoruz.
 *
 * GOOGLE BUNU DESTEKLEMİYOR. Açık olsun: bu script Google'ın dizinine
 * hiçbir şey yapmaz. Google için tek yol Search Console'dan elle istek.
 * Buradan kazanılan yerler Bing, Yandex, Seznam, Naver — ve Bing önemli,
 * çünkü ChatGPT aramasını besliyor. Arapça konuşan gezginlerin giderek
 * daha büyük kısmı seyahat araştırmasını oradan yapıyor.
 *
 * ANAHTAR NASIL ÇALIŞIYOR. `public/<anahtar>.txt` dosyası canlıda
 * yayınlanıyor ve içinde anahtarın kendisi yazıyor. Arama motoru bildirimi
 * alınca o dosyayı okuyup "bu adresi bildiren gerçekten site sahibi mi"
 * diye doğruluyor. Yani anahtar GİZLİ DEĞİL — zaten herkese açık
 * yayınlanıyor; işlevi gizlilik değil, sahiplik kanıtı. Bu yüzden repoda
 * durması doğru, `~/.config` içine saklanacak bir sır değil.
 *
 * Kullanım:  node scripts/indexnow.mjs [--dry]
 */

const HOST = "rufaiturizm.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/* Anahtar dosyanın ADINDAN okunuyor, elle yazılmıyor: iki yerde tutulsa
   ilk değişiklikte biri unutulur ve doğrulama sessizce başarısız olur. */
import { readdirSync } from "node:fs";
const keyFile = readdirSync(new URL("../public", import.meta.url))
  .find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
if (!keyFile) {
  console.error("public/ içinde IndexNow anahtar dosyası yok.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const xml = await fetch(SITEMAP).then((r) => r.text());
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.error("Site haritasından adres çıkmadı — gönderim yapılmadı.");
  process.exit(1);
}

console.log(`${urlList.length} adres, anahtar ${key.slice(0, 8)}…`);

if (process.argv.includes("--dry")) {
  console.log("--dry: gönderilmedi.");
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${keyFile}`,
    urlList,
  }),
});

/* 200 ve 202 ikisi de başarı: 202 "aldım, anahtarı sonra doğrulayacağım"
   demek ve ilk gönderimde normal olan yanıt bu. */
const body = await res.text();
console.log(`HTTP ${res.status} ${res.statusText}`, body ? `— ${body.slice(0, 200)}` : "");
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
