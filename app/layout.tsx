import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "@/app/fonts";
import { SITE } from "@/lib/site";
import { siteJsonLd } from "@/lib/schema";
import { LanguageProvider } from "@/context/LanguageContext";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "VYNTEX | AI Automation, Web Development & Digital Technology — Northfield, NJ",
    template: "%s | VYNTEX",
  },
  description:
    "VYNTEX builds AI-powered websites, automation systems, CRMs, and full brand packages for businesses of every size. Bilingual English and Spanish service. Based in Northfield, NJ. Clear, upfront pricing.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "AI automation",
    "web development",
    "CRM systems",
    "branding",
    "digital marketing",
    "Northfield NJ",
    "bilingual",
    "Spanish",
    "chatbot",
    "small business websites",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "es-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_US"],
    url: SITE.url,
    siteName: SITE.name,
    title: "VYNTEX | AI Automation, Web Development & Digital Technology",
    description:
      "AI-powered websites, automation, CRMs, and branding. Bilingual service. Based in Northfield, NJ.",
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "VYNTEX — AI Automation, Web Development & Digital Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYNTEX | AI Automation & Web Development",
    description:
      "AI-powered websites, automation, CRMs, and branding. Bilingual EN/ES service. Northfield, NJ.",
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050714",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // Verified-facts-only structured data (see lib/schema.ts).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
      </head>
      <body className="min-h-screen bg-vx-bg font-sans text-vx-ink antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
