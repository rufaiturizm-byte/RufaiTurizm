import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Tek alan adı: www olan istek www olmayana yönleniyor.
 *
 * 2026-09-26'da ölçüldü: `https://www.rufaiturizm.com/` sayfayı 200 ile
 * SERVİS EDİYORDU. Yani site iki adresten birden yayındaydı ve arama
 * motoru için bu iki ayrı site demek — tarama hakkı ikiye bölünür,
 * bağlantı değeri ikiye bölünür.
 *
 * Sayfalardaki canonical zaten www'siz adresi gösteriyor ve tek başına
 * çoğu durumda yeterli; ama canonical bir TAVSİYE, yönlendirme bir
 * KURAL. Dizine girmenin zaten zor olduğu bir sitede tavsiyeye
 * güvenmenin anlamı yok.
 *
 * 308 kullanılıyor (301 değil): Next'in kalıcı yönlendirme kodu bu ve
 * isteğin yöntemini koruyor. Arama motorları ikisini aynı sayıyor.
 */
const CANONICAL_HOST = "rufaiturizm.com";

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return intl(request);
}

export const config = {
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
