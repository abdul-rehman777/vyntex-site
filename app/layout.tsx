import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "@/app/fonts";
import { SITE } from "@/lib/site";
import { siteJsonLd } from "@/lib/schema";
import { LanguageProvider } from "@/context/LanguageContext";
import SiteAtmosphere from "@/components/SiteAtmosphere";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "VYNTEX | Connected Business Systems",
    template: "%s | VYNTEX",
  },
  description:
    "VYNTEX connects CRM, communication, automation, scheduling, payments, marketing, reporting, and operations into one organized business system.",
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
    title: "VYNTEX | Connected Business Systems",
    description:
      "Connect CRM, communication, automation, scheduling, payments, marketing, reporting, and operations in one organized business system.",
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "VYNTEX — Connected Business Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYNTEX | Connected Business Systems",
    description:
      "A premium technology partner for connected CRM, automation, communication, websites, payments, and business operations.",
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
      <body className="min-h-screen font-sans text-vx-ink antialiased">
        <LanguageProvider>
          <SiteAtmosphere />
          <div className="site-content">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
