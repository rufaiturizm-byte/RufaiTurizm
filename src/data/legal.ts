/**
 * Yasal metinler: gizlilik ve kullanım şartları.
 *
 * BU METİNLER SİTENİN GERÇEĞİNİ ANLATIYOR, şablon değil. Yazılmadan önce
 * kodda ölçüldü: sitede form, üyelik, sepet ve ödeme YOK; kişisel veri
 * tutan bir veritabanı da yok. Ziyaretçiden alınan tek şey ölçüm verisi
 * (GA4 ve Vercel) ve barındırma sunucusunun tuttuğu istek kaydı. İletişim
 * WhatsApp üzerinden kuruluyor, yani sohbetin kendisi Meta'nın hizmetinde.
 *
 * İnternette dolaşan hazır gizlilik metinleri "üyelik bilgileriniz",
 * "ödeme kartınız", "sipariş geçmişiniz" gibi bu sitede KARŞILIĞI
 * OLMAYAN maddelerle dolu. Olmayan bir veri işlemeyi beyan etmek, veri
 * toplamayı gizlemek kadar yanlış: ikisi de ziyaretçiye gerçek olmayan
 * bir resim veriyor.
 *
 * TASLAKTIR. Hukuk metni yazmak avukatın işi; buradaki metin sitenin ne
 * yaptığını doğru anlatıyor ama hukuki denetimden geçmedi ve bu
 * kullanıcıya açıkça söylendi (2026-10-06).
 *
 * ÇEREZ BANDI YOK ve bu bilinçli bir boşluk değil, karar bekleyen bir
 * konu: GA4 ölçüm çerezi yazıyor ve KVKK/GDPR açısından bunun için onay
 * istemek gerekiyor. Bant eklemek dönüşümü düşürür; eklememek uyum
 * riskini sürdürür. Karar işletmeye ait, metin şu an durumu olduğu gibi
 * anlatıyor.
 */

export type Text = { tr: string; ar: string; en: string };

export interface LegalSection {
  heading: Text;
  /** Paragraflar `\n\n` ile ayrılıyor. */
  body: Text;
}

export interface LegalDoc {
  key: "privacy" | "terms";
  /** Son güncelleme — metin değişince elle güncellenir. */
  updated: string;
  title: Text;
  intro: Text;
  sections: LegalSection[];
}

export const legalDocs: LegalDoc[] = [
  {
    key: "privacy",
    updated: "2026-10-06",
    title: {
      tr: "Gizlilik ve çerez politikası",
      ar: "سياسة الخصوصية وملفات تعريف الارتباط",
      en: "Privacy and cookie policy",
    },
    intro: {
      tr: "Bu sayfa, rufaiturizm.com'u ziyaret ettiğinizde hangi verilerin işlendiğini anlatır. Kısa cevap: sitede form, üyelik ve ödeme yok; sizden ad, telefon ya da e-posta istemiyoruz. İşlenen tek şey ziyaret ölçümü ve sunucu kaydı.",
      ar: "تشرح هذه الصفحة ما تُعالَج من بيانات عند زيارتكم موقع rufaiturizm.com. والجواب المختصر: لا يوجد في الموقع نموذج ولا تسجيل عضوية ولا دفع، ولا نطلب منكم اسماً ولا رقماً ولا بريداً إلكترونياً. وما يُعالَج هو قياس الزيارة وسجلّ الخادم فقط.",
      en: "This page explains what data is processed when you visit rufaiturizm.com. The short answer: the site has no forms, no accounts and no payments, and we do not ask you for a name, phone number or email address. The only things processed are visit measurement and server logs.",
    },
    sections: [
      {
        heading: {
          tr: "Veri sorumlusu",
          ar: "المسؤول عن البيانات",
          en: "Who is responsible",
        },
        body: {
          tr: "RUFAİ İSTANBUL TURİZM — TÜRSAB belge numarası 12539. Adres: Karadolap, Konfor Sk. No:1 D:7A, 34220 Eyüpsultan/İstanbul. E-posta: info@rufaiturizm.com\n\nBelge numarası tursab.org.tr üzerinden doğrulanabilir.",
          ar: "RUFAİ İSTANBUL TURİZM — رقم وثيقة TÜRSAB 12539. العنوان: Karadolap, Konfor Sk. No:1 D:7A, 34220 Eyüpsultan/İstanbul. البريد الإلكتروني: info@rufaiturizm.com\n\nويمكن التحقّق من رقم الوثيقة عبر موقع tursab.org.tr.",
          en: "RUFAİ İSTANBUL TURİZM — TÜRSAB licence number 12539. Address: Karadolap, Konfor Sk. No:1 D:7A, 34220 Eyüpsultan/İstanbul. Email: info@rufaiturizm.com\n\nThe licence number can be verified at tursab.org.tr.",
        },
      },
      {
        heading: {
          tr: "Hangi veriler işleniyor",
          ar: "ما البيانات التي تُعالَج",
          en: "What data is processed",
        },
        body: {
          tr: "Ziyaret ölçümü: Google Analytics 4 hangi sayfaların görüntülendiğini, ziyaretin ne kadar sürdüğünü ve hangi ülkeden gelindiğini ölçer. Ayrıca Vercel Analytics ve Vercel Speed Insights sayfa açılış hızını ölçer; bu ikisi çerez kullanmaz.\n\nSunucu kaydı: Site Vercel üzerinde barındırılıyor ve her istek sunucu kaydına düşer — IP adresi, tarayıcı bilgisi, istek zamanı ve açılan adres.\n\nWhatsApp: Sitedeki düğmeler WhatsApp uygulamasını açar. Yazdığınız mesaj ve telefon numaranız bize WhatsApp üzerinden ulaşır; sohbetin kendisi Meta'nın hizmetinde tutulur ve onun kurallarına tabidir.\n\nSitede form, üyelik, sepet ya da ödeme ekranı yoktur. Bu sitenin kendi veritabanında saklanan hiçbir kişisel veriniz yoktur.",
          ar: "قياس الزيارة: يقيس Google Analytics 4 الصفحات التي تُشاهَد ومدّة الزيارة والبلد الذي جاءت منه. كما يقيس Vercel Analytics وVercel Speed Insights سرعة فتح الصفحة، وهذان لا يستخدمان ملفات تعريف الارتباط.\n\nسجلّ الخادم: الموقع مُستضاف على Vercel، وكل طلب يُسجَّل في سجلّ الخادم — عنوان IP ومعلومات المتصفّح ووقت الطلب والعنوان المفتوح.\n\nواتساب: تفتح أزرار الموقع تطبيق واتساب. فتصلنا رسالتكم ورقم هاتفكم عبر واتساب، أمّا المحادثة نفسها فمحفوظة في خدمة Meta وخاضعة لقواعدها.\n\nلا يوجد في الموقع نموذج ولا عضوية ولا سلّة ولا شاشة دفع. ولا تُحفَظ أي بيانات شخصية تخصّكم في قاعدة بيانات هذا الموقع.",
          en: "Visit measurement: Google Analytics 4 measures which pages are viewed, how long a visit lasts and which country it comes from. Vercel Analytics and Vercel Speed Insights measure how fast pages load; neither uses cookies.\n\nServer logs: The site is hosted on Vercel and every request is written to a server log — IP address, browser details, the time of the request and the address opened.\n\nWhatsApp: The buttons on the site open the WhatsApp app. Your message and phone number reach us through WhatsApp; the conversation itself is held on Meta's service and governed by its rules.\n\nThe site has no forms, accounts, basket or payment screen. No personal data about you is stored in this site's own database.",
        },
      },
      {
        heading: {
          tr: "Çerezler",
          ar: "ملفات تعريف الارتباط",
          en: "Cookies",
        },
        body: {
          tr: "Site, Google Analytics'in ölçüm çerezlerini (_ga ve _ga_ ile başlayan adlar) kullanır. Bunlar aynı ziyaretçinin tekrar gelip gelmediğini anlamaya yarar; reklam amacıyla kullanılmaz ve üçüncü taraflara satılmaz.\n\nTarayıcınızın ayarlarından çerezleri silebilir ya da engelleyebilirsiniz. Site çerezler olmadan da tam olarak çalışır; yalnız ziyaretiniz ölçüme girmez.",
          ar: "يستخدم الموقع ملفات تعريف الارتباط الخاصة بالقياس في Google Analytics (الأسماء التي تبدأ بـ _ga و_ga_). وهي تُستخدم لمعرفة ما إذا كان الزائر نفسه قد عاد؛ ولا تُستخدم لأغراض الإعلان ولا تُباع لأطراف ثالثة.\n\nويمكنكم حذف ملفات تعريف الارتباط أو منعها من إعدادات المتصفّح. والموقع يعمل كاملاً من دونها، غير أنّ زيارتكم لا تدخل في القياس.",
          en: "The site uses Google Analytics measurement cookies (names beginning with _ga and _ga_). They are used to tell whether the same visitor has returned; they are not used for advertising and are not sold to third parties.\n\nYou can delete or block cookies in your browser settings. The site works fully without them; your visit simply is not counted in the measurement.",
        },
      },
      {
        heading: {
          tr: "Yurt dışına aktarım",
          ar: "النقل إلى خارج البلاد",
          en: "Transfers abroad",
        },
        body: {
          tr: "Kullandığımız üç hizmetin sunucuları yurt dışındadır: Google (ölçüm), Vercel (barındırma) ve Meta (WhatsApp). Siteyi ziyaret ettiğinizde ya da WhatsApp'tan yazdığınızda veriler bu şirketlerin sistemlerinden geçer ve her biri kendi gizlilik politikasına tabidir.",
          ar: "خوادم الخدمات الثلاث التي نستخدمها موجودة خارج البلاد: Google (القياس) وVercel (الاستضافة) وMeta (واتساب). فعند زيارتكم الموقع أو مراسلتنا على واتساب تمرّ البيانات عبر أنظمة هذه الشركات، ويخضع كلٌّ منها لسياسة الخصوصية الخاصة به.",
          en: "The three services we use have their servers abroad: Google (measurement), Vercel (hosting) and Meta (WhatsApp). When you visit the site or write to us on WhatsApp, data passes through these companies' systems, each governed by its own privacy policy.",
        },
      },
      {
        heading: {
          tr: "Haklarınız ve başvuru",
          ar: "حقوقكم وكيفية التقدّم بطلب",
          en: "Your rights and how to apply",
        },
        body: {
          tr: "KVKK'nın 11. maddesi size şu hakları verir: kişisel verinizin işlenip işlenmediğini öğrenmek, işlenmişse bilgi talep etmek, düzeltilmesini veya silinmesini istemek, aktarıldığı üçüncü kişileri öğrenmek ve işlemeye itiraz etmek.\n\nBaşvurunuzu info@rufaiturizm.com adresine yazabilirsiniz. En geç otuz gün içinde yanıt veriyoruz.\n\nPratik bir not: sitede bizde duran bir veriniz olmadığı için çoğu talep aslında Google, Vercel ya da WhatsApp tarafındaki kayıtlarla ilgilidir; başvurunuzda hangi hizmetten söz ettiğinizi yazarsanız doğru yere yönlendirebiliriz.",
          ar: "تمنحكم المادة 11 من قانون حماية البيانات الشخصية التركي (KVKK) الحقوق الآتية: معرفة ما إذا كانت بياناتكم الشخصية تُعالَج، وطلب معلومات عنها إن كانت كذلك، وطلب تصحيحها أو حذفها، ومعرفة الجهات التي نُقلت إليها، والاعتراض على المعالجة.\n\nويمكنكم إرسال طلبكم إلى info@rufaiturizm.com. ونردّ خلال ثلاثين يوماً على أبعد تقدير.\n\nوملاحظة عملية: لأنّه لا توجد لديكم بيانات محفوظة عندنا في الموقع، فإنّ معظم الطلبات تتعلّق في الحقيقة بسجلّات لدى Google أو Vercel أو واتساب؛ فإن ذكرتم في طلبكم الخدمة المقصودة أمكننا إرشادكم إلى الجهة الصحيحة.",
          en: "Article 11 of Türkiye's data protection law (KVKK) gives you these rights: to learn whether your personal data is processed, to request information if it is, to ask for correction or deletion, to learn which third parties it was transferred to, and to object to the processing.\n\nYou can send your request to info@rufaiturizm.com. We reply within thirty days at the latest.\n\nA practical note: because we hold no data about you on this site, most requests actually concern records held by Google, Vercel or WhatsApp; if you tell us which service you mean, we can point you to the right place.",
        },
      },
      {
        heading: {
          tr: "Çocuklar",
          ar: "الأطفال",
          en: "Children",
        },
        body: {
          tr: "Site çocuklara yönelik değildir ve on sekiz yaşından küçüklerden bilerek veri toplamaz. Rezervasyon her zaman yetişkin bir misafirle kurulur.",
          ar: "الموقع ليس موجَّهاً إلى الأطفال، ولا نجمع عن قصد بيانات ممّن هم دون الثامنة عشرة. ويتمّ الحجز دائماً مع ضيف بالغ.",
          en: "The site is not aimed at children and we do not knowingly collect data from anyone under eighteen. A booking is always made with an adult guest.",
        },
      },
      {
        heading: {
          tr: "Bu metin değişirse",
          ar: "إذا تغيّر هذا النص",
          en: "If this text changes",
        },
        body: {
          tr: "Sitede ölçüm araçları ya da iletişim yolları değişirse bu sayfa güncellenir ve üstteki tarih değişir. Geriye dönük bir bildirim göndermiyoruz; sayfadaki tarih, metnin hangi tarihteki durumu anlattığını gösterir.",
          ar: "إذا تغيّرت أدوات القياس أو وسائل التواصل في الموقع فسنحدّث هذه الصفحة ويتغيّر التاريخ المذكور أعلاه. ولا نرسل إشعاراً بأثر رجعي؛ فالتاريخ في الصفحة يبيّن الحالة التي يصفها النص.",
          en: "If the measurement tools or contact channels on the site change, this page is updated and the date above changes with it. We do not send retrospective notifications; the date on the page shows which state of affairs the text describes.",
        },
      },
    ],
  },
  {
    key: "terms",
    updated: "2026-10-06",
    title: {
      tr: "Kullanım şartları",
      ar: "شروط الاستخدام",
      en: "Terms of use",
    },
    intro: {
      tr: "Bu sayfa, sitedeki bilgilerin ne anlama geldiğini ve rezervasyonun nasıl kurulduğunu anlatır. Site bir vitrin: üzerinden rezervasyon tamamlanmaz, ödeme alınmaz.",
      ar: "تشرح هذه الصفحة ما تعنيه المعلومات الواردة في الموقع وكيف يتمّ الحجز. والموقع واجهة عرض: لا يُستكمَل الحجز عبره ولا يُستوفى دفع.",
      en: "This page explains what the information on the site means and how a booking is made. The site is a shop window: no booking is completed and no payment is taken through it.",
    },
    sections: [
      {
        heading: {
          tr: "Siteyi kim işletiyor",
          ar: "من يدير الموقع",
          en: "Who runs the site",
        },
        body: {
          tr: "Site, TÜRSAB belgeli seyahat acentesi RUFAİ İSTANBUL TURİZM tarafından işletilir (belge no 12539). Sunulan hizmetler havalimanı transferi, şoförlü araç, özel tur, çok günlü programlar ile uçak bileti ve otel rezervasyonudur.",
          ar: "يدير الموقعَ وكالةُ السفر المرخّصة من TÜRSAB، RUFAİ İSTANBUL TURİZM (رقم الوثيقة 12539). والخدمات المقدَّمة هي النقل من المطار، وسيارة مع سائق، والجولات الخاصة، والبرامج متعددة الأيام، وحجز تذاكر الطيران والفنادق.",
          en: "The site is run by RUFAİ İSTANBUL TURİZM, a travel agency licensed by TÜRSAB (licence no. 12539). The services offered are airport transfers, a car with driver, private tours, multi-day programmes, and flight and hotel booking.",
        },
      },
      {
        heading: {
          tr: "Sitedeki fiyatlar ve süreler",
          ar: "الأسعار والمدد في الموقع",
          en: "Prices and times on the site",
        },
        body: {
          tr: "Yazılı fiyatlar başlangıç fiyatıdır ve araç başınadır, kişi başına değil. Kesin tutar kişi sayısı, tarih, güzergâh ve otel sınıfına göre WhatsApp görüşmesinde netleşir; teyit edilen rakam sonradan değişmez.\n\nMesafeler ve süreler yaklaşıktır. Trafiğin belirlediği bir şeyi dakika olarak taahhüt etmiyoruz; sayfalarda yazan aralıklar gerçek yolculuklara dayanan tahminlerdir.\n\nOtel sayfalarındaki bilgiler otelin kendi resmî sitesinden alınmıştır ve o otel tarafından değiştirilebilir. Fiyat, müsaitlik ve oda tipi rezervasyon sırasında otelden teyit edilir.",
          ar: "الأسعار المكتوبة هي أسعار ابتداءً، وهي للسيارة لا للشخص. ويتحدّد المبلغ النهائي في محادثة واتساب بحسب عدد الأشخاص والتاريخ وخطّ السير وفئة الفندق؛ والرقم المؤكَّد لا يتغيّر بعد ذلك.\n\nالمسافات والمدد تقريبية. فنحن لا نلتزم بالدقيقة بما تحدّده حركة المرور؛ والنطاقات المكتوبة في الصفحات تقديرات مبنية على رحلات حقيقية.\n\nأمّا المعلومات في صفحات الفنادق فمأخوذة من الموقع الرسمي للفندق نفسه وقد يغيّرها الفندق. ويُؤكَّد السعر والتوافر ونوع الغرفة من الفندق عند الحجز.",
          en: "Published prices are starting prices and are per vehicle, not per person. The final figure is settled in the WhatsApp conversation according to the number of people, the date, the route and the hotel class; once confirmed, the figure does not change.\n\nDistances and times are approximate. We do not promise to the minute what traffic decides; the ranges on the pages are estimates based on real journeys.\n\nThe details on hotel pages come from each hotel's own official site and may be changed by that hotel. Price, availability and room type are confirmed with the hotel at booking.",
        },
      },
      {
        heading: {
          tr: "Rezervasyon nasıl kurulur",
          ar: "كيف يتمّ الحجز",
          en: "How a booking is made",
        },
        body: {
          tr: "Rezervasyon WhatsApp üzerinden kurulur. Tarih, kişi sayısı ve program yazışmada netleşir; biz toplam tutarı ve gün gün taslağı gönderdiğimizde ve siz onayladığınızda rezervasyon kurulmuş olur.\n\nSitedeki hiçbir düğme tek başına rezervasyon oluşturmaz. Sayfalardaki \"fiyat sor\" ve \"WhatsApp\" bağlantıları yalnızca görüşmeyi başlatır.\n\nİptal ve değişiklik koşulları hizmete göre değişir ve teklifle birlikte yazılı olarak iletilir.",
          ar: "يتمّ الحجز عبر واتساب. فتُحدَّد التواريخ وعدد الأشخاص والبرنامج في المراسلة؛ وحين نرسل المبلغ الإجمالي والمسوّدة يوماً بيوم وتوافقون عليها يكون الحجز قد تمّ.\n\nولا يُنشئ أي زر في الموقع حجزاً بذاته. فروابط «اسأل عن السعر» و«واتساب» في الصفحات تبدأ المحادثة فقط.\n\nأمّا شروط الإلغاء والتعديل فتختلف بحسب الخدمة وتُرسَل كتابةً مع العرض.",
          en: "A booking is made over WhatsApp. Dates, the number of people and the programme are settled in the conversation; the booking exists once we have sent the total and the day-by-day outline and you have agreed to it.\n\nNo button on the site creates a booking by itself. The \"ask about the price\" and \"WhatsApp\" links only start the conversation.\n\nCancellation and change terms differ by service and are sent to you in writing with the quote.",
        },
      },
      {
        heading: {
          tr: "İçeriğin kullanımı",
          ar: "استخدام المحتوى",
          en: "Use of the content",
        },
        body: {
          tr: "Sitedeki metinler, fotoğraflar ve tasarım Rufai Turizm'e aittir. Kaynak göstererek alıntı yapmak serbesttir; metinleri ya da fotoğrafları başka bir sitede kendi içeriğiymiş gibi yayınlamak değildir.\n\nFilo fotoğraflarının tamamı işletmenin kendi çekimidir. Semt ve şehir fotoğrafları için kullanım hakkı alınmıştır ve künyede belirtilmiştir.",
          ar: "النصوص والصور والتصميم في الموقع مملوكة لـ Rufai Turizm. ويجوز الاقتباس مع ذكر المصدر؛ أمّا نشر النصوص أو الصور في موقع آخر على أنها محتواه فلا يجوز.\n\nوجميع صور أسطولنا من تصوير الشركة نفسها. أمّا صور الأحياء والمدن فقد حُصل على حقّ استخدامها وذُكر ذلك في بيان المصادر.",
          en: "The text, photographs and design on this site belong to Rufai Turizm. Quoting with attribution is fine; republishing the text or photographs on another site as its own content is not.\n\nAll fleet photographs are the company's own. Usage rights have been obtained for district and city photographs and are stated in the credits.",
        },
      },
      {
        heading: {
          tr: "Dış bağlantılar",
          ar: "الروابط الخارجية",
          en: "External links",
        },
        body: {
          tr: "Sayfalarda otellerin resmî siteleri, TÜRSAB sorgu sayfası ve harita gibi dış bağlantılar bulunur. Bu sitelerin içeriğinden ve gizlilik uygulamalarından sorumlu değiliz.",
          ar: "تتضمّن الصفحات روابط خارجية مثل المواقع الرسمية للفنادق وصفحة الاستعلام في TÜRSAB والخرائط. ولسنا مسؤولين عن محتوى هذه المواقع ولا عن ممارساتها في الخصوصية.",
          en: "The pages contain external links such as hotels' official sites, the TÜRSAB lookup page and maps. We are not responsible for the content or the privacy practices of those sites.",
        },
      },
      {
        heading: {
          tr: "Uygulanacak hukuk",
          ar: "القانون الواجب التطبيق",
          en: "Governing law",
        },
        body: {
          tr: "Bu siteden doğan ilişkilere Türkiye Cumhuriyeti hukuku uygulanır; uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir. Paket tur hizmetleri ayrıca 1618 sayılı kanun ve Paket Tur Sözleşmeleri Yönetmeliği hükümlerine tabidir.",
          ar: "يسري على العلاقات الناشئة عن هذا الموقع قانونُ الجمهورية التركية، وتختصّ محاكم إسطنبول ودوائر التنفيذ فيها بالنزاعات. كما تخضع خدمات الرحلات المنظَّمة لأحكام القانون رقم 1618 ولائحة عقود الرحلات المنظَّمة.",
          en: "Relations arising from this site are governed by the law of the Republic of Türkiye, and the courts and enforcement offices of Istanbul have jurisdiction over disputes. Package tour services are additionally subject to Law no. 1618 and the Package Tour Contracts Regulation.",
        },
      },
    ],
  },
];

export function legalDocByKey(key: LegalDoc["key"]) {
  return legalDocs.find((doc) => doc.key === key)!;
}
