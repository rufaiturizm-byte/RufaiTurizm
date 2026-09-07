# Araç ve ofis görselleri — kaynak ve künye

Bu klasördeki fotoğrafların tamamı **Rufai Turizm'in kendi çekimleridir**.
Stok görsel yok. Önceki hallerinde Unsplash'ten alınmış stok araç
fotoğrafları vardı; 7 Eylül 2026'da gerçek filo ve ofis fotoğraflarıyla
değiştirildi.

| Dosya | İçerik |
|---|---|
| vito-exterior.jpg | Ofis önünde sıralanmış beş siyah Mercedes Vito; tabela ve TÜRSAB rozeti görünür |
| vito-interior.jpg | Yan kapısı açık Vito — taba rengi kapitone deri VIP koltuk, arka camda Rufai çıkartması |
| vito-fleet.jpg | Filo açılı görünüm, bahar çiçekleri ve ofis tabelası |
| ../office.jpg | Ofis vitrini ve oturma alanı (dikey kadraj, hakkımızda sayfasında) |

## Neden stok fotoğraf kaldırıldı

Stok iç mekân fotoğrafı **siyah deri** bir Vito gösteriyordu; gerçek
araçların koltukları **taba rengi kapitone**. İkisi aynı sayfada yan yana
durunca fark ediliyor ve "sitedeki araç, havalimanında gelen araçtır"
sözünü doğrudan çürütüyordu. Körfez pazarında bu tür bir tutarsızlık
en pahalı güven kaybı.

Bu değişiklikle iki metin de artık DOĞRU:
- `fleet.listSubtitle` — "Havalimanında gelen araç, sitede gördüğünüz araçtır."
- `fleet.stockNote` — eskiden "görseller araç tipini temsil eder" diyordu,
  şimdi "bu fotoğraflar kendi filomuza ait" diyor.

## Kalan stok görseller (bu klasörün dışında)

`public/images/chauffeur.jpg` hâlâ stok bir şoför fotoğrafı. Gerçek bir
şoför/ekip fotoğrafı geldiğinde aynı dosya adıyla değiştirilebilir;
kod değişikliği gerekmez. Yer fotoğrafları için `public/images/places/KUNYE.md`.

## Fotoğraflardaki ayrıntılar

Plakalar şirketin kendi ticari araçlarına ait, bilerek bırakıldı — gerçek
olduklarının kanıtı. Görsellerde EXIF ve konum verisi yok, kontrol edildi.

Ofis vitrinindeki havayolu logoları işletmenin kendi tabela tasarımıdır;
sitede hiçbir yerde "havayolu ortaklığı" olarak sunulmuyor ve öyle
sunulmamalı.
