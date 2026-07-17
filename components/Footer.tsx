"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SITE, CONTACT_HREFS, LEGAL_LINKS } from "@/lib/site";
import Container from "@/components/ui/Container";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Newsletter Subscriber",
          businessName: "",
          email,
          phone: "",
          serviceInterest: "other",
          preferredContact: "email",
          message: "Please add this email address to VYNTEX business updates.",
          consent: true,
          language: lang,
          honeypot: "",
          startedAt: Date.now() - 2000,
        }),
      });
      if (!response.ok) throw new Error("subscribe failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const words = lang === "es" ? {
    services: "Servicios",
    industries: "Industrias",
    resources: "Recursos",
    quick: "Enlaces Rápidos",
    contact: "Contacto",
    newsletter: "Actualizaciones",
    newsletterBody: "Ideas prácticas sobre CRM, automatización y sistemas empresariales.",
    emailPlaceholder: "Correo electrónico",
    subscribe: "Suscribirse",
    success: "Gracias. Recibimos su solicitud.",
    error: "No se pudo enviar. Escríbanos directamente.",
    ctaTitle: "¿Listo para conectar su negocio?",
    ctaBody: "Comience con una consulta clara y sin presión.",
    cta: "Reservar Consulta",
  } : {
    services: "Services",
    industries: "Industries",
    resources: "Resources",
    quick: "Quick Links",
    contact: "Contact",
    newsletter: "Business Updates",
    newsletterBody: "Practical ideas about CRM, automation, and connected business systems.",
    emailPlaceholder: "Email address",
    subscribe: "Subscribe",
    success: "Thanks. Your request was received.",
    error: "Could not submit. Please email us directly.",
    ctaTitle: "Ready to connect your business?",
    ctaBody: "Start with a clear, no-pressure consultation.",
    cta: "Book Consultation",
  };

  return (
    <footer className="border-t border-vx-line bg-vx-bg2/70">
      <Container className="py-14 sm:py-16">
        <div className="mb-12 flex flex-col gap-6 rounded-2xl border border-vx-blue/25 bg-vx-blue/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><h2 className="text-2xl font-bold">{words.ctaTitle}</h2><p className="mt-2 text-sm text-vx-muted">{words.ctaBody}</p></div>
          <Button onClick={openConsultation}>{words.cta}<ArrowRight size={17}/></Button>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5" aria-label={SITE.name}>
              <Image src="/vyntex-mark.png" alt="" width={52} height={45} className="h-11 w-auto" />
              <span className="text-xl font-bold tracking-tight vx-grad-text">VYNTEX</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-vx-muted">{t.footer.tagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-vx-silver"><MapPin size={15}/>{SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}</p>
            <div className="mt-4"><LanguageToggle /></div>
          </div>

          <nav aria-label={words.services}><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">{words.services}</h2><ul className="mt-4 space-y-2 text-sm text-vx-muted">
            <li><Link href="/services/crm-systems" className="hover:text-vx-ink">CRM Systems</Link></li>
            <li><Link href="/services/ai-automation" className="hover:text-vx-ink">AI Automation</Link></li>
            <li><Link href="/services/web-development" className="hover:text-vx-ink">Web Development</Link></li>
            <li><Link href="/services/digital-marketing" className="hover:text-vx-ink">Digital Marketing</Link></li>
            <li><Link href="/services/branding" className="hover:text-vx-ink">Branding</Link></li>
          </ul></nav>

          <nav aria-label={words.industries}><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">{words.industries}</h2><ul className="mt-4 space-y-2 text-sm text-vx-muted">
            <li><Link href="/industries" className="hover:text-vx-ink">Accounting</Link></li>
            <li><Link href="/industries" className="hover:text-vx-ink">Medical Offices</Link></li>
            <li><Link href="/industries" className="hover:text-vx-ink">Home Services</Link></li>
            <li><Link href="/industries" className="hover:text-vx-ink">Construction</Link></li>
            <li><Link href="/industries" className="hover:text-vx-ink">Professional Services</Link></li>
          </ul></nav>

          <nav aria-label={words.resources}><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">{words.resources}</h2><ul className="mt-4 space-y-2 text-sm text-vx-muted">
            <li><Link href="/how-it-works" className="hover:text-vx-ink">How It Works</Link></li>
            <li><Link href="/pricing" className="hover:text-vx-ink">Pricing</Link></li>
            <li><Link href="/partners" className="hover:text-vx-ink">Partner Program</Link></li>
            <li><Link href="/contact#faq" className="hover:text-vx-ink">FAQ</Link></li>
            <li><Link href="/about" className="hover:text-vx-ink">About Vyntex</Link></li>
          </ul></nav>

          <div><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">{words.contact}</h2><ul className="mt-4 space-y-3 text-sm">
            <li><a href={CONTACT_HREFS.email} className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"><Mail size={15}/>{SITE.email}</a></li>
            <li><a href={CONTACT_HREFS.phonePrimary} className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"><Phone size={15}/>{SITE.phonePrimary}</a></li>
            <li><a href={CONTACT_HREFS.phoneSecondary} className="inline-flex items-center gap-2 text-vx-silver hover:text-vx-ink"><Phone size={15}/>{SITE.phoneSecondary}</a></li>
          </ul></div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-vx-line pt-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">{words.newsletter}</h2><p className="mt-3 max-w-xl text-sm text-vx-muted">{words.newsletterBody}</p></div>
          <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="footer-email">{words.emailPlaceholder}</label>
            <input id="footer-email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={words.emailPlaceholder} className="min-h-11 flex-1 rounded-xl border border-vx-line bg-vx-bg px-4 text-sm outline-none focus:border-vx-blue"/>
            <button type="submit" disabled={status === "sending"} className="min-h-11 rounded-xl bg-vx-blue px-5 text-sm font-bold text-vx-bg transition hover:brightness-110 disabled:opacity-60">{words.subscribe}</button>
          </form>
          {status === "done" ? <p className="text-sm text-vx-cyan lg:col-start-2">{words.success}</p> : null}
          {status === "error" ? <p className="text-sm text-red-300 lg:col-start-2">{words.error}</p> : null}
        </div>

        <div className="mt-10 border-t border-vx-line pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-vx-muted">{t.footer.laborNote}</p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-vx-muted">© {year} {SITE.name}. {t.footer.rights}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-vx-muted">{LEGAL_LINKS.map((l)=><li key={l.key}><Link href={l.href} className="hover:text-vx-ink">{t.footer.legal[l.key]}</Link></li>)}</ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
