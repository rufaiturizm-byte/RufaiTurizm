export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        Tur · Transfer · Seyahat
      </p>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        Rufai Turizm
      </h1>

      <p className="max-w-md text-balance text-neutral-600 dark:text-neutral-400">
        Yeni web sitemiz üzerinde çalışıyoruz. Çok yakında burada olacağız.
      </p>

      <a
        href="mailto:info@rufaiturizm.com"
        className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Bize ulaşın
      </a>
    </main>
  );
}
