/**
 * Rehberlerin yayın tarihleri.
 *
 * Article şemasında `datePublished` yoktu ve json-ld.tsx'teki yorum
 * sebebini yazıyordu: uydurma bir tarih tazelik konusunda yanlış sinyal
 * verir. Doğru tarih ise zaten elimizdeydi — git, her rehberin hangi gün
 * yazıldığını tutuyor. Bu dosya oradan üretildi:
 *
 *   git log -S 'slug: "<slug>"' --reverse --format=%aI -- src/data/guides.ts
 *
 * Slug dizesi arandı, satır aralığı DEĞİL: `git log -L` aralığı takip
 * ediyor ve o satırlarda daha önce başka bir rehber durduğu için Adalar
 * rehberine dört gün eski bir tarih veriyordu.
 *
 * Yeni rehber eklendiğinde buraya bir satır girilir. Slug eşleşmezse
 * şemaya tarih basılmaz — yanlış tarih basmaktansa alan hiç olmasın.
 *
 * `dateModified` bilerek YOK. Şu an yirmi altı rehberin son değişiklik
 * tarihi aynı, çünkü ortak bir alan (okuma süresi) hepsinden birden
 * kaldırıldı. Doğru ama hiçbir şey anlatmayan bir sinyal; sitemap.ts
 * aynı tuzağı zaten anlatıyor — bütün sayfalar aynı tarihi taşırsa
 * Google alanı tümden yok sayıyor.
 */
export const guidePublishedDates: Record<string, string> = {
  "istanbul-havalimanindan-sehre-ulasim": "2026-09-05",
  "istanbulda-nerede-kalinir": "2026-09-05",
  "sabiha-gokcenden-istanbula-ulasim": "2026-09-05",
  "sapanca-masukiye-rehberi": "2026-09-05",
  "trabzon-uzungol-karadeniz": "2026-09-05",
  "turkiyeye-ne-zaman-gitmeli": "2026-09-05",
  "arapca-konusan-sofor-ve-rehber": "2026-09-06",
  "bogaz-turu-rehberi": "2026-09-06",
  "bursa-uludag-gunubirlik": "2026-09-06",
  "cocuklu-ailelerle-istanbul": "2026-09-06",
  "istanbulda-bir-hafta-aile-programi": "2026-09-06",
  "istanbulda-helal-yemek-rehberi": "2026-09-06",
  "istanbulda-uc-gun-programi": "2026-09-06",
  "turkiyede-alisveris-rehberi": "2026-09-06",
  "istanbulda-hava-durumu-ve-giyim": "2026-09-07",
  "istanbulda-toplu-tasima-rehberi": "2026-09-07",
  "turkiyede-balayi-rehberi": "2026-09-07",
  "turkiyede-sehirler-arasi-mesafeler": "2026-09-07",
  "antalya-bolge-rehberi": "2026-09-08",
  "bodrum-ege-rehberi": "2026-09-08",
  "istanbul-adalar-rehberi": "2026-09-09",
  "otel-secerken-nelere-bakmali": "2026-09-09",
  "ramazan-ve-bayramda-turkiye": "2026-09-09",
  "turkiyede-para-kart-ve-odeme": "2026-09-09",
  "turkiyede-sim-kart-ve-internet": "2026-09-09",
  "turkiyede-tatil-butcesi-nasil-kurulur": "2026-09-09",
  "istanbulda-gezilecek-yerler": "2026-09-10",
  "istanbulda-anadolu-yakasi": "2026-09-10",
};
