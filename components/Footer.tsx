"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  SITE,
  CONTACT_HREFS,
  SECTION_IDS,
  LEGAL_LINKS,
} from "@/lib/site";
import Container from "@/components/ui/Container";
import LanguageToggle from "@/components/ui/LanguageToggle";

/**
 * Site footer: brand + services + company + contact, with a legal/utility
 * bottom strip. Uses centralized SITE data and translations. Legal pages are
 * scaffolded in a later phase; links are in place now.
 */
export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const companyLinks: { key: keyof typeof t.footer.company; href: string }[] = [
    { key: "about", href: "/about" },
    { key: "howItWorks", href: "/how-it-works" },
    { key: "industries", href: "/industries" },
    { key: "partners", href: "/partners" },
    { key: "faq", href: "/contact#faq" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-[rgba(14,165,233,0.12)] bg-vx-bg2/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={SITE.name}
            >
              <Image
                src="/vyntex-mark.png"
                alt=""
                width={52}
                height={45}
                className="h-11 w-auto"
              />
              <span className="text-xl font-bold tracking-tight vx-grad-text">
                VYNTEX
              </span>
            </Link>
            <p className="max-w-xs text-sm text-vx-muted">{t.footer.tagline}</p>
            <p className="inline-flex items-center gap-2 text-sm text-vx-silver">
              <MapPin size={15} aria-hidden />
              {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}
            </p>
            <LanguageToggle className="mt-1" />
          </div>

          {/* Services */}
          <nav aria-label={t.footer.servicesHeading} className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">
              {t.footer.servicesHeading}
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-vx-muted">
              <li>
                <Link href="/services/web-development" className="hover:text-vx-ink">
                  {t.footer.services.websites}
                </Link>
              </li>
              <li>
                <Link href="/services/ai-automation" className="hover:text-vx-ink">
                  {t.footer.services.ai}
                </Link>
              </li>
              <li>
                <Link href="/services/crm-systems" className="hover:text-vx-ink">
                  {t.footer.services.crm}
                </Link>
              </li>
              <li>
                <Link href="/services/branding" className="hover:text-vx-ink">
                  {t.footer.services.branding}
                </Link>
              </li>
              <li>
                <Link href="/services/digital-marketing" className="hover:text-vx-ink">
                  {t.footer.services.social}
                </Link>
              </li>
              <li>
                <Link href="/services/digital-marketing" className="hover:text-vx-ink">
                  {t.footer.services.marketing}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label={t.footer.companyHeading} className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">
              {t.footer.companyHeading}
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-vx-muted">
              {companyLinks.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="hover:text-vx-ink">
                    {t.footer.company[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">
              {t.footer.contactHeading}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={CONTACT_HREFS.email}
                  className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"
                >
                  <Mail size={15} aria-hidden />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_HREFS.phonePrimary}
                  className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"
                >
                  <Phone size={15} aria-hidden />
                  {SITE.phonePrimary}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_HREFS.phoneSecondary}
                  className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"
                >
                  <Phone size={15} aria-hidden />
                  {SITE.phoneSecondary}
                </a>
              </li>
              <li className="text-vx-muted">{t.footer.hoursNote}</li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[rgba(14,165,233,0.12)] pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-vx-muted">
            {t.footer.laborNote}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-vx-muted">
              © {year} {SITE.name}. {t.footer.rights}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-vx-muted">
              {LEGAL_LINKS.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="hover:text-vx-ink">
                    {t.footer.legal[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
