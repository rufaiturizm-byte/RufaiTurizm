# Rufai Turizm — Görsel Art Direction Brief

## 1. Marka hissi

Rufai Turizm, Türkiye'ye gelen Arap aileler ve premium bireysel gezginler için güven veren, sakin, özenli ve üst segment bir seyahat markasıdır. Görseller **turistik kartpostal** gibi değil; butik concierge hizmeti veren, detaylara önem veren bir markanın reklam fotoğrafları gibi görünmelidir.

Ana duygu: **"Türkiye'yi zahmetsiz, güvenli ve şık biçimde deneyimleme."**

Görsellerde kesinlikle yazı, logo, filigran, fiyat etiketi, Türk bayrağı, rastgele tabelalar veya tanınan araç markası/logosu olmamalıdır. Sitedeki metin ve CTA'lar görselin üzerine kodla gelecektir.

## 2. Ortak görsel dil

| Konu | Kural |
| --- | --- |
| Fotoğraf türü | Gerçekçi, üst segment editoryal/lifestyle seyahat fotoğrafı |
| Işık | Gün doğumu, golden hour veya yumuşak mavi saat; doğal, sinematik ama karanlık değil |
| Renkler | İstanbul'un derin laciverti, sıcak taş tonları, yumuşak altın gün ışığı, doğal yeşiller ve temiz siyahlar |
| İnsan kullanımı | Doğal, zarif ve mütevazı giyimli aileler veya profesyonel şoförler; poz veren stok fotoğraf hissi olmamalı |
| Araç | Temiz, uzun gövdeli siyah premium VIP minivan; marka, amblem ve plaka okunmamalı |
| İşleme | Hafif filmik kontrast, gerçek materyal dokuları, abartısız alan derinliği |
| Kaçınılacaklar | Neon renkler, HDR gökyüzü, AI kusurlu eller/yüzler, aşırı lüks gösterişi, kolaj, illüstrasyon, metin |

## 3. Üretim kuralları

- Ana bannerlar **16:9 yatay** üretilsin; ideal: 2048 × 1152.
- Tur kartları **4:3 yatay** üretilsin; ideal: 1536 × 1152.
- Görseller PNG veya yüksek kaliteli JPG indirilsin.
- Hero görsellerinde metin için kadrajın bir yanında temiz, daha koyu/az detaylı alan bırakılmalı.
- Aynı sahnede maksimum 1–3 insan olsun; kalabalık ve karmaşa oluşmasın.
- Üretilen görselde metin çıkarsa yeniden üret; metni sonradan silmeye çalışma.

## 4. Ortak negatif prompt

Her promptun sonuna şunu ekle:

```text
No text, no typography, no logos, no watermarks, no vehicle badges, no readable licence plates, no flags, no distorted people, no extra fingers, no CGI, no illustration, no collage, no oversaturated HDR colours, no tourist crowds, no stock-photo posing.
```

---

## 5. Görsel listesi ve hazır üretim promptları

### A. Ana sayfa hero — İstanbul ve Boğaz

**Kullanım:** Ana sayfanın ilk büyük bannerı. Başlık ve butonlar sol bölümde duracağı için sol tarafta temiz koyu alan gerekli.

```text
Use case: photorealistic-natural
Asset type: premium travel website hero banner, 16:9 horizontal
Primary request: A cinematic luxury travel photograph of Istanbul at blue hour, viewed from a quiet Bosphorus waterfront terrace. Ortaköy Mosque is visible in the distance with the Bosphorus bridge lights softly glowing, elegant and authentic Istanbul atmosphere.
Scene/backdrop: Calm Bosphorus water, refined waterfront architecture, soft evening haze; no crowds.
Subject: Istanbul skyline and Ortaköy Mosque as the visual focal point.
Style/medium: High-end editorial travel photography, photorealistic, subtle film grain.
Composition/framing: Wide panoramic composition. Keep the LEFT 40 percent calm, dark and low-detail for website title overlay. Put the mosque and illuminated skyline in the right half.
Lighting/mood: Sophisticated blue-hour light, warm gold reflections on water, deep navy shadows; peaceful, safe, premium.
Color palette: Deep navy, warm muted gold, stone, soft natural whites.
Constraints: no text, no logos, no watermarks, no flags, no tourist crowds, no exaggerated HDR.
```

### B. VIP Vito banner — Özel transfer

**Kullanım:** Ana sayfa VIP transfer bandı ve hizmetler sayfası üst görseli. Metin solda; araç sağda yer almalı.

```text
Use case: ads-marketing
Asset type: premium VIP transfer website banner, 16:9 horizontal
Primary request: A spotless black premium VIP minivan parked beside an elegant Istanbul waterfront hotel at dusk. The vehicle is unbranded, with no visible badge or readable licence plate. A discreet professional chauffeur in a dark tailored suit stands nearby, naturally opening the rear door.
Scene/backdrop: Refined hotel entrance, Bosphorus-side Istanbul atmosphere, warm architectural lighting, clean pavement.
Subject: The black VIP minivan; clearly realistic, immaculate paint with tasteful reflections.
Style/medium: Luxury automotive and hospitality campaign photography, photorealistic.
Composition/framing: Low three-quarter angle. Place the vehicle in the RIGHT half; preserve clean dark negative space on the LEFT for website copy.
Lighting/mood: Blue hour with warm amber hotel lights, understated elegance, reassuring and exclusive.
Color palette: Black, deep navy, champagne gold, warm stone.
Constraints: no text, no logos, no watermarks, no vehicle badges, no readable licence plates, no overly glossy CGI.
```

### C. Havalimanı transferi / profesyonel şoför

**Kullanım:** İletişim, transfer hizmeti ve transfer formu çevresi.

```text
Use case: photorealistic-natural
Asset type: premium airport transfer service banner, 16:9 horizontal
Primary request: A professional Turkish chauffeur greeting a travelling family at the covered arrival lane of Istanbul Airport beside an unbranded black premium VIP minivan. The moment feels effortless and welcoming; a family has modest elegant travel clothing and a small amount of quality luggage.
Scene/backdrop: Modern clean international airport curbside, soft architectural lines, no readable signs.
Subject: Warm professional service interaction, chauffeur and family; the minivan remains visible.
Style/medium: High-end hospitality editorial photography, photorealistic.
Composition/framing: Wide scene with generous clear space at the top-left for page title; candid, not posed.
Lighting/mood: Gentle morning daylight, clean and calm, trustworthy.
Color palette: Ivory, soft grey, deep navy, black, subtle warm gold.
Constraints: no text, no logos, no watermarks, no readable airport signs, no brand logos, no distorted faces or hands.
```

### D. Kız Kulesi — Hakkımızda / SSS bannerı

**Kullanım:** Hakkımızda ve SSS sayfası bannerı. Sakin, kültürel İstanbul sahnesi.

```text
Use case: photorealistic-natural
Asset type: elegant Istanbul cultural website banner, 16:9 horizontal
Primary request: The Maiden's Tower in Istanbul seen from the Üsküdar waterfront at early morning, calm water and a soft atmospheric skyline. The scene should feel exclusive, serene and authentic rather than like a postcard.
Scene/backdrop: Bosphorus water, pale sky, distant historic Istanbul silhouette, restrained waterfront details.
Subject: Maiden's Tower, naturally integrated in the composition.
Style/medium: Refined editorial travel photograph, photorealistic, subtle filmic texture.
Composition/framing: Wide composition; leave a quiet darker region on the LEFT for title overlay; tower on the right-third.
Lighting/mood: Early morning soft gold, calm, timeless, welcoming.
Color palette: Deep blue, muted gold, warm ivory, soft grey-blue.
Constraints: no text, no logos, no watermarks, no crowds, no boats blocking the tower, no oversaturated postcard effect.
```

### E. İstanbul tur kartı

```text
Use case: photorealistic-natural
Asset type: premium tour card image, 4:3 horizontal
Primary request: A refined Istanbul old city scene with Hagia Sophia and Sultanahmet silhouettes at warm golden hour, viewed from a clean elevated street perspective. The scene is peaceful and editorial, not crowded.
Style/medium: High-end travel magazine photography, photorealistic.
Composition/framing: 4:3 landscape; architectural landmark clear but with natural foreground depth.
Lighting/mood: Warm golden hour, elegant, richly textured stone and soft blue sky.
Constraints: no text, no logos, no watermarks, no flags, no crowds, no HDR, no postcard styling.
```

### F. Bursa tur kartı

```text
Use case: photorealistic-natural
Asset type: premium tour card image, 4:3 horizontal
Primary request: A tranquil luxury travel scene in Bursa: the historic Ulu Mosque and elegant Ottoman stone architecture framed by mature plane trees, with Mount Uludağ softly present in the far background.
Style/medium: High-end editorial travel photography, photorealistic.
Composition/framing: 4:3 landscape, balanced architecture and nature, no crowd.
Lighting/mood: Fresh clear morning with gentle warm sunlight.
Color palette: Natural green, warm stone, deep blue shadows, restrained gold sunlight.
Constraints: no text, no logos, no watermarks, no flags, no tourist crowds, no oversaturated colours.
```

### G. Sapanca tur kartı

```text
Use case: photorealistic-natural
Asset type: premium tour card image, 4:3 horizontal
Primary request: A serene early-morning view across Sapanca Lake, with a small wooden lakeside pier, lush mature trees and soft mountain mist. The setting feels peaceful and exclusive.
Style/medium: Premium nature and travel editorial photography, photorealistic.
Composition/framing: 4:3 landscape with leading lines from the pier toward the misty lake.
Lighting/mood: Soft sunrise glow, subtle mist, quiet luxury.
Color palette: Moss green, deep navy reflections, warm pale gold, soft natural grey.
Constraints: no text, no logos, no watermarks, no people, no cabins, no oversaturated green, no fantasy look.
```

### H. Trabzon tur kartı

```text
Use case: photorealistic-natural
Asset type: premium tour card image, 4:3 horizontal
Primary request: An elegant Black Sea mountain valley near Trabzon, with lush green slopes, low soft clouds, a quiet winding road and an authentic stone bridge in the distance. It should feel natural, upscale and cinematic.
Style/medium: High-end nature travel photography, photorealistic.
Composition/framing: 4:3 landscape, layered foreground, valley and mountain depth.
Lighting/mood: Post-rain soft light with sun rays through clouds, tasteful and realistic.
Color palette: Deep greens, misty blue-grey, warm subtle light.
Constraints: no text, no logos, no watermarks, no people, no fantasy landscape, no excessive fog, no HDR.
```

### I. Bodrum tur kartı

```text
Use case: photorealistic-natural
Asset type: premium tour card image, 4:3 horizontal
Primary request: A sophisticated Bodrum marina at sunset, with whitewashed hillside architecture, calm turquoise Aegean water and a few elegant unbranded sailboats. The scene feels relaxed, private and Mediterranean.
Style/medium: Luxury Mediterranean travel editorial photography, photorealistic.
Composition/framing: 4:3 landscape, water foreground, architecture and marina in the middle distance.
Lighting/mood: Soft sunset, creamy warm light, understated glamour.
Color palette: Aegean blue, chalk white, warm sand, muted gold.
Constraints: no text, no logos, no watermarks, no crowded beach, no party scene, no oversized yachts, no HDR.
```

## 6. Seçim kontrol listesi

Bir görseli indirip siteye koymadan önce şunları kontrol et:

1. Metin, logo, filigran veya okunabilir plaka yok mu?
2. Web başlığı için yeterli boş alan var mı?
3. İnsan yüzleri, elleri ve araç çizgileri doğal mı?
4. Görselin renkleri diğer görsellerle lacivert–altın hissinde birleşiyor mu?
5. Aşırı kalabalık, turistik klişe veya yapay HDR görünümünden uzak mı?
6. Kartta 4:3, bannerda 16:9 kadraj korunuyor mu?

## 7. Dosya eşlemesi

Üretimden sonra görseller şu dosya adlarıyla kaydedilmelidir:

| Görsel | Dosya yolu |
| --- | --- |
| Ana hero | `public/images/hero-premium.jpg` |
| VIP Vito | `public/images/vito-premium.jpg` |
| Havalimanı transferi | `public/images/airport-transfer-premium.jpg` |
| Kız Kulesi | `public/images/maiden-tower-premium.jpg` |
| İstanbul | `public/images/tours/istanbul-premium.jpg` |
| Bursa | `public/images/tours/bursa-premium.jpg` |
| Sapanca | `public/images/tours/sapanca-premium.jpg` |
| Trabzon | `public/images/tours/trabzon-premium.jpg` |
| Bodrum | `public/images/tours/bodrum-premium.jpg` |
