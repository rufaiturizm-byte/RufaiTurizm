"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  /**
   * Binlik ayracı. Yıl gibi sayı olmayan değerlerde kapatılır:
   * 2015 varsayılan biçimlendirmede "2,015" olarak basılıyor ve
   * "Deneyim Yılı" etiketinin altında iki bin on beş yıllık bir
   * tecrübe iddiası gibi okunuyordu.
   */
  grouping?: boolean
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  grouping = true,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  /*
   * Yay sertliği artırıldı (100 → 220), sönüm kritik sönümün biraz
   * üstünde (34) tutuldu: aşmadan, düz bir tırmanışla oturuyor.
   *
   * Önceki ayarla sayaç 12.000'e ulaşması 5,6 saniye sürüyordu ve bu
   * sürenin tamamı boyunca ekranda EKSİK bir rakam duruyordu — ilk
   * saniyede "+6.148 Mutlu Misafir". Rakamı olduğundan küçük göstermek,
   * animasyondan elde edilen her şeyden pahalıya mal olur. Yeni ayarla
   * yaklaşık 1,7 saniyede bitiyor.
   */
  const springValue = useSpring(motionValue, { damping: 34, stiffness: 220 })
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reduced = useReducedMotion()

  /*
   * Biçimlendirme SAYFANIN DİLİNDE.
   *
   * Burada `"en-US"` yazılıydı ve site üç dilli. Sonuç Türkçe sayfada
   * "+12,000 Mutlu Misafir" ve "4.9 / 5" idi: Türkçede binlik ayracı
   * NOKTA, ondalık ayracı VİRGÜLDÜR — yani ekranda yazan şey "12 virgül
   * 000" ve "4 nokta 9" oluyordu. Puan için bu doğrudan yanlış bilgi:
   * 4.9 Türkçe okuyan biri için bozuk bir sayı.
   *
   * Rakamlar sayfanın en güven verici öğesi olmaya çalışıyor; yanlış
   * ayraçla yazılmış bir rakam tam tersini yapıyor.
   *
   * Arapça ölçüldü, çünkü `ar` yerel ayarının Hint-Arap rakamlarına
   * (١٢٬٠٠٠) düşmesinden şüphelenilmişti: hem Node 22'nin tam ICU'su
   * hem Chrome "12,000" ve "4.9" veriyor, yani `en` ile aynı. Sitenin
   * geri kalanı (€60 gibi) zaten Batı rakamlarıyla yazılı, dolayısıyla
   * Arapça sayfada da tutarlılık bozulmuyor.
   *
   * Sunucu ile tarayıcının aynı çıktıyı vermesi ayrıca hidrasyon
   * uyuşmazlığı olmadığı anlamına geliyor — ilk değer sunucuda basılıyor.
   */
  const locale = useLocale()

  const format = (n: number) =>
    Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: grouping,
    }).format(Number(n.toFixed(decimalPlaces)))

  /*
   * Sayaç YALNIZCA ekranın altında başlayan sayılarda çalışır.
   *
   * Önceki hali sunucuda `startValue`ı (yani 0'ı) basıyordu ve doğru
   * sayıyı ancak tarayıcıda JS çalışınca yazıyordu. JS gelmeyen ya da
   * geç gelen bir ziyaretçi ana sayfada "+0 Mutlu Misafir" ve
   * "0 / 5 Google Puanımız" görüyordu — sıfır misafir ve sıfır puan
   * iddiası, olmayan bir animasyondan çok daha pahalıya mal olur.
   *
   * Artık sunucu DOĞRU sayıyı basıyor. Sayaç yalnız öğe ilk boyamada
   * görüş alanının dışındaysa kuruluyor; zaten görünen bir sayıyı
   * sıfıra düşürüp geri tırmandırmak sıçrama yaratırdı.
   */
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const box = el.getBoundingClientRect()
    if (box.top >= window.innerHeight) setArmed(true)
  }, [reduced])

  useEffect(() => {
    if (!armed || !isInView) return
    if (ref.current) ref.current.textContent = format(startValue)
    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? startValue : value)
    }, delay * 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, isInView, delay, value, direction, startValue, motionValue])

  /*
   * Yay asimptotik yaklaşır: eşiğe girince `change` olayı kesiliyor ve
   * ekranda son okunan ara değer kalıyordu — "+11.994 Mutlu Misafir".
   * Hedefe yaklaştığı anda tam sayıya oturtuluyor; ayrıca animasyon
   * bittiğinde ikinci bir kez yazılıyor ki hiçbir durumda yaklaşık bir
   * rakam ekranda kalmasın.
   */
  useEffect(() => {
    if (!armed) return
    const target = direction === "down" ? startValue : value
    const esik = Math.pow(10, -decimalPlaces) / 2

    const stopChange = springValue.on("change", (latest) => {
      if (!ref.current) return
      ref.current.textContent = format(
        Math.abs(latest - target) < esik ? target : latest,
      )
    })
    const stopDone = springValue.on("animationComplete", () => {
      if (ref.current) ref.current.textContent = format(target)
    })

    return () => {
      stopChange()
      stopDone()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue, decimalPlaces, grouping, armed, value, startValue, direction])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {format(value)}
    </span>
  )
}
