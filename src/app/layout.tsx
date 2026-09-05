import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rufaiturizm.com"),
  title: {
    default: "Rufai Turizm",
    template: "%s | Rufai Turizm",
  },
  description:
    "Rufai Turizm — tur, transfer ve seyahat organizasyonu hizmetleri.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "LkEz3TOB4Fl4zl0wZpe_qL5G0HvViMDKC_rsMdzGdP4",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
