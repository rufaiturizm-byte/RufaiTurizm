# Rakip sitelerden alınacak özellikler

Kaynak: `refs/İstediğim özellikler/` — 7 ekran görüntüsü, **7'si de incelendi**.

| # | Dosya | Kaynak site | Ne var |
|---|---|---|---|
| A | 19.19.36 | seentravels | "Öne Çıkan Seyahat Paketleri" + header ISO rozetleri |
| B | 19.19.46 | seentravels | "Paketlerimiz ve Teklifleri" — USD fiyatlı kartlar |
| C | 19.19.52 | makamtourism | "Özel tekliflerimiz" — indirim rozeti + WhatsApp butonu |
| D | 19.19.58 | cabistanbul | Resmî belgeler ve ruhsatlar bandı |
| E | 19.20.06 | cabistanbul | Puan kırılımlı müşteri yorumları |
| F | 19.20.13 | cabistanbul | Rezervasyon rehberi (5 adım + senaryolar) |
| G | 19.20.18 | cabistanbul | Transfer rezervasyon formu + güven kutuları |

---

## 1. Çok günlük paket kartları  ★ öncelik
`seentravels` "Öne Çıkan Seyahat Paketleri" ve "Paketlerimiz ve Teklifleri"
bölümleri. Bizde sadece günübirlik turlar var; Körfezli aile 5–10 günlük
program arıyor. Kart yapısı:

- Fotoğraf + sol/sağ üstte renkli etiket (şehir veya program adı)
- Başlık
- Konum satırı (pin ikonu + şehir)
- Fiyat: ya "Başlangıç fiyatı 528 $" ya da "Fiyat talep üzerine"
- Buton: "Ayrıntıları Gör →" veya doğrudan WhatsApp

Bizdeki durum: `src/data/tours.ts` yalnız 5 günübirlik tur tutuyor
(`durationHours`). Paket için ayrı tip gerekir (gün sayısı, konaklama,
program günleri).

## 2. USD fiyat gösterimi  ★ öncelik
`seentravels` fiyatları dolarla veriyor (2.333 $ / 528 $ / 657 $).
Bağımsız tasarım incelemesi de aynı şeyi söylemişti: Körfez müşterisi
USD ile düşünür. Bizde şu an sadece € (`currency: "EUR"`,
kartta `€{tour.priceFrom}`). En az USD karşılığı gösterilmeli.

Biçim: küçük gri "Başlangıç fiyatı" etiketi + büyük renkli rakam.

## 3. "Fiyat talep üzerine" seçeneği
Her ürüne fiyat yazmak zorunda değiliz. Özel/lüks programlarda
"Fiyat talep üzerine — en iyi fiyat için bize ulaşın" + WhatsApp butonu.
Niteliksiz talebi elemeden mesaj almayı sürdürür.

Ekran A'da fiyat bloğunun üstünde ince ayırıcı çizgi var, altında da
tek satır gri açıklama. Kartta fiyat alanı hep aynı yüksekliği kaplıyor —
fiyatlı ve fiyatsız kartlar yan yana bozulmuyor.

## 4. Her kartta WhatsApp butonu
`makamtourism` her kartta iki buton kullanıyor (alt alta, tam genişlik):
"Daha fazlasını göster" (outline) + "Şimdi rezervasyon yapın" (yeşil, WhatsApp ikonlu).
`seentravels` ise tek yeşil buton koyuyor: "Rezervasyon için bize ulaşın".
Bizde kart tıklaması detaya gidiyor, doğrudan WhatsApp butonu yok.

Kartın tamamı `<Link>` olduğu için buton iç içe geçmemeli — kart sarmalayıcısını
`<article>` yapıp başlığı link, butonu ayrı eleman yapmak gerekir.

## 5. Sertifika rozetleri header'da
`seentravels` header'ında ISO 9001 (Kalite) ve ISO 27001 (Güvenlik)
rozetleri duruyor — dil seçicinin hemen solunda, yuvarlak ikon + iki satır metin.
Bizde TÜRSAB var ama sadece hero'da; header'da yok
(`src/components/site/header.tsx`).

## 6. Yatay kaydırmalı carousel
Ürün sayısı arttığında kartlar yatay kayıyor, sağda ok düğmesi.
Masaüstünde de mobilde de aynı bileşen. `src/components/ui/carousel.tsx`
(embla) zaten kurulu, kullanılmıyor.

## 7. Kartlarda şehir etiketi
Her kartın üstünde şehir rozeti (İstanbul, Sapanca, Bursa).
Kullanıcı listede gezerken nerede olduğunu anında görüyor.
Bizde kartın altında süre + fiyat rozeti var, şehir yok.

---

# cabistanbul'dan alınacaklar

## 8. "Resmi Belgeler ve Ruhsatlar" bölümü  ★★ en güçlüsü
Beş belge, her birinin altında altın "✓ DOĞRULANMIŞ" işareti:

- TÜRSAB — T.C. Kültür ve Turizm Bakanlığı
- U-ETDS / U-NET — No: 1028933 (rakibin numarası; bizimki gelecek)
- İBB İstanbul Büyükşehir Belediyesi Ulaşım Lisansı
- Yolcu Sigortası — Zorunlu Koltuk Ferdi Kaza Sigortası
- 4.9 Puan — Google ve sosyal medya yorumları

Düzen (ekran D): **altın/amber zeminli tam genişlik bant**, üstünde koyu kartlar.
Sol üstte küçük harf aralıklı etiket "RESMİ BELGELER VE RUHSATLAR",
sağ üstte tek satır vaat: "Her transfer yasal çerçevede, sigortalı ve kayıtlı".
Her kartın içinde: gerçek kurum logosu (ikon değil, **logo görseli**) +
sağ üstte küçük amber nokta + başlık + açıklama + doğrulama satırı.

Bizim gece lacivert + altın temamıza birebir oturuyor: altın bant + `--brand-night` kart.
Ortadoğu pazarında dolandırıcılık kaygısı yüksek; bu bölüm doğrudan
o kaygıyı hedefliyor. Bizde TÜRSAB tek satır olarak duruyor ve
`src/config/site.ts → credentials` boş.

## 9. Puan kırılımlı müşteri yorumları  ★★
Koyu zeminli bölüm, başlık "Dünyanın dört bir yanından **güvenen yolcular**"
(vurgu altın renkte). Solda sabit puan kartı, sağda iki sıra carousel:

**Puan kartı (sol):** büyük "4.9" + 5 yıldız + "Yüzlerce yayınlanmış müşteri
yorumuna göre". Altında dört alt başlık, her biri 5.0 ve **altın ilerleme
çubuğu**: Dakiklik · Profesyonellik · Araç konforu · Fiyat/performans.
En altta G logolu "Google yorumları" butonu (dışarı link).

**Üst sıra:** Google yorumları — daire avatar (baş harf), isim, tarih,
5 yıldız, sağ üstte G logosu, uzun metin kart içinde kaydırılıyor.
**Alt sıra:** referans yorumları — fotoğraflı avatar, isim + ünvan/ülke
(فاطمة السعد — هندسة معمارية · Dmitry Ivanov — Customer · Marina Papadopoulos — Greece),
tarih, yıldız, italik alıntı.
İki sırada da yanlarda yuvarlak ok düğmeleri, altta nokta göstergesi.

Kritik nokta: **yorumlar çevrilmiyor, orijinal dilinde duruyor** —
Arapça, İngilizce, Rusça karışık. Bu, yorumların gerçek olduğunun kanıtı gibi
çalışıyor. Bizde yorum bölümü hiç yok.

## 10. Transfer rezervasyon formu (tur aramasından ayrı)
Ekran G: koyu araç fotoğrafı üzerinde beyaz kart.

- **Üstte iki sekme:** "İSTANBUL HAVALİMANI ÖZEL TRANSFER" (aktif, altın hap)
  / "ŞOFÖRLÜ ARAÇ KİRALAMA" (outline hap) → tek formda iki hizmet modu
- Alanlar: Alış noktası · yanında "Durak ekle" düğmesi · Varış noktası
  (placeholder "havalimanı, otel, bölge") · Tarih/Saat (takvim ikonu) ·
  Kişi sayısı (kişi ikonu + açılır liste)
- Tam genişlik altın "ARA →" butonu
- Altında iki kutucuk: "Dönüş: aynı konum" / "Dönüş: farklı konum" +
  altın çip "Gidiş–dönüş transferde %20 indirim"
- En altta üç tikli güven satırı: "Sabit fiyatlı transfer — sürpriz ücret yok" ·
  "VIP araçlarla konforlu ulaşım" · "Paylaşımsız özel yolculuk"

NOT: Ana sayfadaki genel arama şeridini kaldırdık (arkasında altyapı
yoktu). Bu form ondan farklı — transfer sayfasına özel ve seçimler
yine WhatsApp mesajını doldurabilir. Bizde `ui/tabs`, `ui/calendar`,
`ui/select`, `ui/popover` hazır; arka uç gerekmez, "ARA" yerine
"WhatsApp'tan teklif al" yazıp seçimleri mesaja gömmek yeterli.

## 11. "Rezervasyon Rehberi" bölümü
Formun nasıl kullanılacağını beş adımda anlatıyor: yuvarlak ikonlar
çizgiyle bağlı, her birinin sağ altında numara rozeti —
Kalkış Noktası (1) · Varış Noktası (2) · Tarih & Saat (3) ·
Yolcu Sayısı (4) · Dönüş & Ara Duraklar (5), altlarında tek satır açıklama.

Altında altın kenarlıklı iki örnek senaryo kartı, renkli nokta çipleri
oklarla zincirlenmiş:
- "ARA DURAKLI TRANSFER": IST Airport → Stop: Nişantaşı → Hotel Taksim
  · 👥 3 kişi · ⏱ ~55 dk · 💰 Sabit fiyat
- "FARKLI LOKASYON DÖNÜŞ": IST Airport → Hotel Sultanahmet → Return: Restaurant → SAW
  · 👥 2 kişi · %20 iade indirim · Sabit fiyat

Karmaşık talebi olan müşteriyi kaybetmemek için iyi bir fikir.

## 12. Dört güven kutusu (transfer sayfası)
Formun hemen altında koyu bantta, ikon + başlık + alt satır:
İstanbul'un tüm havalimanları (IST ve SAW kapsamında) · Sabit fiyat garantisi
(Sürpriz ücret ve zam yok) · Ruhsatlı ve sigortalı filo (Profesyonel operasyon) ·
7/24 destek (Her zaman ulaşılabilir ekibimiz).

---

# Kalan 4 ekrandan çıkan yeni maddeler

## 13. İndirim rozeti (köşe)
`makamtourism` kart görselinin sağ üst köşesinde yeşil köşe rozeti: **25**, **20**, **20**
— yüzde indirim. Görsel olarak güçlü, "acele et" hissi veriyor.
Yalnız gerçek indirim varken kullanılmalı; sürekli duran sahte indirim
Körfez müşterisinde güven kaybettirir.

## 14. Bölüm başlığı kalıbı
Her iki rakipte de aynı: solda dikey renkli çubuk + kalın başlık,
altında tek satır gri alt başlık, sağ uçta "Tüm Paketler →" bağlantısı.
Bizde ana sayfada başlık + sağda "Tüm turlar" butonu var ama alt başlık
ve accent çubuk yok — küçük ama tüm sayfalarda tekrar eden bir kalıp,
tek bileşen (`SectionHeading`) olarak yazılmalı.

## 15. Rakip navigasyonunda bizde olmayan sayfalar
`seentravels` menüsü: Ana Sayfa · Özel Teklifler · Seçkin Oteller ·
Seen Tur Programları · Günlük Turlar · Transferler · **Fiyatlar** ·
**Seyahat Rehberleri** · SSS.
Bizim menümüz 5 madde (`header.tsx`): Ana sayfa, Turlar, Hizmetler,
Hakkımızda, İletişim. Değerlendirilecek ek başlıklar:
- **Fiyatlar** — tek sayfada tüm tur/transfer fiyat listesi (SEO'da güçlü)
- **Seyahat Rehberleri** — blog/rehber içeriği, organik trafik kapısı
- **Özel Teklifler** — indirimli paketler (13 ile birlikte)
- Oteller bizim işimiz değilse alınmayacak.

## 16. Marka programı etiketi
`seentravels` kartlarında şehir rozetinden ayrı olarak "Seen Programı"
etiketi var — kendi kurduğu turlarla aracılık ettiklerini ayırıyor.
Bizde karşılığı: "Rufai Programı" / "Özel Program" ayrımı yapılabilir.

## 17. Kart CTA'sının iki farklı tonu
Aynı sitede iki kart tipi var: fiyatlı kartlarda **yumuşak dolgulu ikincil buton**
("Ayrıntıları Gör"), fiyatsız kartlarda **tam dolgulu yeşil WhatsApp butonu**.
Yani buton rengi fiyat durumuna göre değişiyor — fiyat yoksa tek yol WhatsApp,
dolayısıyla en güçlü buton oraya konuyor. Bizde de aynı kural uygulanmalı.

## 18. Gerçek kurum logoları gerekiyor
Belgeler bandı (8) ikonla değil, **gerçek logo görselleriyle** çalışıyor:
TÜRSAB, T.C. Kültür ve Turizm Bakanlığı, İBB, Google. `public/brand/`
içinde şu an sadece kendi logomuz var. Bu logolar için kullanım hakkı,
gerçekten belgeye sahip olmayı gerektirir — belge numaraları gelmeden
bu bölüm yayına alınmamalı.

## 19. Araç fotoğrafı formun arkasında
Transfer formu, havalimanında valizli müşteriler + siyah Mercedes Vito
fotoğrafının üzerinde duruyor. Bizde `public/images/vito-black.jpg` var
ama tek bir bantta kullanılıyor. Transfer sayfası için **kendi araç
fotoğraflarımız** (dış, iç, bagaj, şoför) gerekiyor — stok fotoğraf bu
bölümde güveni düşürür.

## 20. RTL uyumu doğal geliyor
Rakip ekranların bir kısmı zaten RTL (makamtourism sağa hizalı başlık,
oklar sola bakıyor). Bizim varsayılan dilimiz Arapça olduğu için tüm bu
bileşenlerde ok yönü (`rtl:rotate-180`), rozet konumu (`inset-inline`)
ve hizalama mantıksal özelliklerle yazılmalı — sabit `left/right` kullanılmamalı.

---

## Uygulama sırası önerisi
1. **Resmi belgeler bölümü (8, 18)** — belge numaraları gelince. Tek başına
   en yüksek güven getirisi.
2. **Çok günlük paketler (1, 3, 7, 13, 16, 17)** — yeni sayfa + yeni kart tipi.
   Hepsi aynı kart bileşenine dokunduğu için birlikte yapılmalı.
3. **Puan kırılımlı yorumlar (9)** — gerçek yorumlar gelince; yorumlar
   orijinal dilinde kalacak.
4. **USD fiyat (2)** — mevcut € fiyatların yanına.
5. **Kartlarda WhatsApp butonu (4)** + bölüm başlığı bileşeni (14).
6. **Transfer formu, rehberi ve güven kutuları (10, 11, 12, 19)** —
   VIP transfer sayfasına.
7. Header rozetleri (5), carousel (6), ek sayfalar (15).

## Bunlar gelmeden yapılamayacaklar
- **WhatsApp numarası** — 8 hariç her madde bu butona bağlı; site canlı ve
  şu an `905000000000`'a gidiyor (`src/config/site.ts`).
- **TÜRSAB + U-ETDS numaraları** → madde 8
- **Gerçek yorumlar (isim + ülke + tarih)** → madde 9
- **Kendi araç fotoğraflarınız** → madde 10, 19
- **Fiyat listesi (USD)** → madde 2, 15
