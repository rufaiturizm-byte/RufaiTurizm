# Yer görselleri — kaynak ve künye

Unsplash'ten alınmış **stok fotoğraflardır**, bizim çektiğimiz kareler değil.
Unsplash lisansı ticari kullanıma izin verir ve atıf zorunlu değildir; künye
yine de burada tutuluyor ki hangi görselin bize ait olmadığı belli olsun.
Kendi fotoğraflarınız geldiğinde aynı dosya adlarıyla değiştirin, kod
değişikliği gerekmez.

| Dosya | İçerik | Fotoğrafçı |
|---|---|---|
| sultanahmet.jpg | Sultanahmet Camii (altı minare) | Paul Bill |
| galata.jpg | Galata Köprüsü, Galata Kulesi ve vapur | Ibrahim Uzun |
| bogaz-kopru.jpg | 15 Temmuz Şehitler Köprüsü ve Boğaz | Youssef Mohamed |
| kadikoy.jpg | Kadıköy iskelesi ve sahil | Fatmanur Şimşek |
| uzungol.jpg | Uzungöl, Trabzon | Sadra Hakim |
| havalimani.jpg | Havalimanı bekleme salonu ve uçak | Oskar Kadaksoo |
| ../tours/antalya.jpg | Antalya Kaleiçi, eski liman ve surlar | Ant Rozetsky |
| kemer.jpg | Kemer: iskele ve denize inen Toroslar | Ondrej Bocek |
| side.jpg | Side, Apollon Tapınağı sütunları (Medusa başlı friz) | Mert Kahveci |
| alanya.jpg | Alanya limanı, Kızıl Kule ve kale | Aysegul Aytören |
| turgutreis.jpg | Turgutreis: koy, yelkenliler ve fener | Deniz Vatan |
| bodrum-koy.jpg | Bodrum yarımadasında bir koy — yamaçta beyaz evler, demirli tekneler | (Unsplash) |

Her kare içeriği doğrulanarak seçildi: arama sonucundaki açıklamalar genel
("a building that looks like a mosque") olduğu için görsellerin hepsi tek tek
açılıp ne olduğu teyit edildi. Aday olan iki kare elendi — biri siyah-beyaz
ve kasvetliydi, diğeri Unsplash+ (Getty) lisanslıydı ve ücretsiz değildi.

## Neden bu dosyalar eklendi

Oteller sayfasında iki bölge YANLIŞ fotoğrafla gösteriliyordu:
Taksim/Beyoğlu için Kız Kulesi (Üsküdar'da) ve Anadolu yakası için Sapanca
(İstanbul'da bile değil). Elimizdeki 13 görsel tüm sayfalara yetmediği için
aynı kareler tekrar tekrar kullanılıyordu.


## Antalya ve Bodrum güzergâhları için eklenenler (8 Eylül 2026)

Dört kare eklendi, dört aday elendi. Elenenler ve nedenleri:

- Unsplash aramasında "Side / antik" etiketiyle çıkan bir tiyatro fotoğrafı
  aslında **Hierapolis** (Pamukkale) idi — Side'ye 400 kilometre uzakta.
  Antalya güzergâh sayfasında kullanılsaydı düpedüz yanlış bilgi olurdu.
  Etiketlere güvenilmedi, her kare açılıp içeriği teyit edildi.
- "Yalıkavak" etiketli bir kare, üzerinde başka bir işletmenin tabelası
  (NOVIKOV) olan bir bina fotoğrafıydı; sayfamızda ortaklık ima ederdi.
- İki kare de kapak olarak elendi: biri tepeden çekim ve çok karanlıktı
  (beyaz başlık metni okunmazdı), diğerinin göğü düz griydi.

Bu yüzden Yalıkavak yerine **Turgutreis** güzergâh sayfası yazıldı:
elimizde içeriği doğrulanmış bir Turgutreis fotoğrafı vardı, Yalıkavak
için yoktu. Yalıkavak, kapsam listesinde (routes.ts) yer alıyor.

## bodrum-koy.jpg neden "Yalıkavak" diye etiketlenmedi

Yalıkavak güzergâh sayfası için içeriği doğrulanmış bir Yalıkavak
fotoğrafı bulunamadı; aday kareler ya tanınabilir değildi ya da başka
bir işletmenin tabelasını taşıyordu. Elimizdeki kare Bodrum
yarımadasından bir koy ve öyle etiketleniyor.

Bunun için `transfer-routes.ts` içine isteğe bağlı `imageAlt` alanı
eklendi: sayfa normalde alt metni olarak varış adını kullanıyor
(Kemer sayfasında Kemer fotoğrafı var), ama fotoğraf varış noktasının
kendisi değilse alt metin onu söylüyor. Doğrulamadığımız bir yeri
adıyla etiketlemek, bu klasörden elenen Hierapolis karesiyle aynı hata
olurdu.
