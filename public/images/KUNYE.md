# Kök dizindeki görseller — kaynak ve künye

`places/KUNYE.md` yer fotoğraflarını anlatıyor; bu dosya `public/images/`
kökündeki karelerin nereden geldiğini tutuyor. Amaç aynı: hangi görselin
bize ait OLMADIĞI belli olsun.

| Dosya | İçerik | Kaynak |
|---|---|---|
| `hero-vito-bogaz.jpg` | Boğaz kıyısında gün batımında siyah VIP minibüs | **YAPAY ZEKÂ ÜRETİMİ** (ChatGPT, 12.09.2026) |
| `hero-ortakoy.jpg` | Ortaköy Camii ve Boğaz — *artık kullanılmıyor* | Unsplash (stok) |
| `kizkulesi.jpg` | Kız Kulesi | Unsplash (stok) |
| `office.jpg` | Ofis içi | Unsplash (stok) |
| `fleet/vito-*.jpg` | **Kendi filomuz**, ofis önünde çekildi | Rufai Turizm |

## hero-vito-bogaz.jpg hakkında

Ana sayfanın giriş görseli. **Gerçek bir fotoğraf değil, yapay zekâ ile
üretildi.** Bu bilinerek yapıldı ve sınırı şu:

- Kare bir SINIF anlatıyor, belirli bir aracı değil. Rufai gerçekten siyah
  Mercedes Vito işletiyor (bkz. `fleet/`), yani görsel var olan bir hizmeti
  temsil ediyor — olmayan bir şeyi değil. Silinen `chauffeur.jpg` tam
  tersiydi: beyaz bir VW minibüs, yani işletilmeyen bir araç sınıfı.
- Üzerinde plaka, yazı ya da "bu bizim aracımız" iddiası yok.
- Alt metni de iddia kurmuyor: "Boğaz kıyısında gün batımında siyah VIP
  Vito" diyor, "filomuzdan bir araç" demiyor.

**Gerçek kareyle değiştirilmeli.** Bir Vito'yu Ortaköy'e ya da Çamlıca'ya
çıkarıp gün batımında çekmek bir öğleden sonralık iş ve sonuç her zaman
üretilmiş bir kareden iyi olur. Dosya adı aynı kalırsa kod değişikliği
gerekmez.

**Teknik not:** kare 1672×940 (16:9) ve araç SAĞDA duruyor. Bu bilerek:
`scrim-x` karartması yönle dönüyor, koyu uç her zaman metnin altında. LTR'de
metin solda olduğu için araç sağda doğru; Arapça'da metin sağa geçtiği için
görsel `[dir="rtl"] .hero-mirror` kuralıyla AYNALANIYOR ve araç sola düşüyor.
Kare aynalanmaya uygun: kabinde direksiyon görünmüyor ve üzerinde asimetrik
bir işaret yok. Yeni bir kare gelirse bu iki koşula dikkat edin.
