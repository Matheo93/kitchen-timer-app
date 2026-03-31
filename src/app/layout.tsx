import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { KitchenThemeProvider } from "@/components/KitchenThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kitchen-timer.app"

export const metadata: Metadata = {
  title: {
    default: "Kitchen Timer — Recipe Step Timer for Home Cooks",
    template: "%s | Kitchen Timer",
  },
  description:
    "A visual step-by-step recipe timer for home cooks. Each cooking stage has its own steam-pot visualization encoding progress through steam and heat arcs. Track every step, never lose your place.",
  keywords: ["recipe timer", "cooking timer", "step-by-step cooking", "home cook", "kitchen timer", "minuteur cuisine", "recette"],
  authors: [{ name: "Kitchen Timer" }],
  creator: "Kitchen Timer",
  applicationName: "Kitchen Timer",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "fr": "/?lang=fr",
    },
  },
  openGraph: {
    title: "Kitchen Timer — Step-by-Step Visual Recipe Timer",
    description: "Visual step-by-step cooking timers. Each stage encoded in steam and arc — never lose your place in a recipe.",
    url: APP_URL,
    siteName: "Kitchen Timer",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Timer — Visual Recipe Timer for Home Cooks",
    description: "Step-by-step visual cooking timers. Steam pot encodes progress — never burn dinner again.",
    creator: "@kitchen_timer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <KitchenThemeProvider>{children}</KitchenThemeProvider>
      </body>
    </html>
  );
}
