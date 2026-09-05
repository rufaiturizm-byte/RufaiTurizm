<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rufai Turizm

Turizm firması için kurumsal web sitesi. Türkçe içerik, açık tema, dönüşüm (CRO) odaklı.

## Yığın

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui — bileşenler `src/components/ui/` içinde, doğrudan düzenlenebilir
- Magic UI — animasyonlu bileşenler (blur-fade, number-ticker, marquee, shimmer-button, border-beam, animated-shiny-text, bento-grid)
- motion — animasyon, lenis — yumuşak kaydırma
- react-hook-form + zod — formlar, embla — galeri/slider, react-day-picker — tarih seçimi
- @vercel/analytics + @vercel/speed-insights — ölçüm

## Komutlar

```bash
npm run dev     # geliştirme
npm run build   # üretim derlemesi — değişiklikten sonra mutlaka çalıştır
npm run lint
```

## Dağıtım

`main` dalına push → Vercel otomatik üretime alır. Canlı: https://rufaiturizm.com

## Kurallar

- Arayüz metinleri Türkçe.
- Yeni bileşen yazmadan önce `src/components/ui/` içinde var mı bak; varsa onu kullan.
- shadcn bileşeni eklemek için: `npx shadcn@latest add <ad>`
- SEO: sayfa `metadata` dışa aktarmalı. `src/app/sitemap.ts` içine yeni sayfaları ekle.
- Görsellerde `next/image` kullan, `alt` metnini Türkçe ve açıklayıcı yaz.
