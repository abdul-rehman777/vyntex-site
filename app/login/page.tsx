"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Container from "@/components/ui/Container";
import LanguageToggle from "@/components/ui/LanguageToggle";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();

  // Secondary client-side guard; middleware also redirects authed users.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        if (active && data.user) router.replace("/portal");
      } catch {
        /* Supabase unconfigured — stay on login. */
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-vx-ink">
          VYNTEX
        </Link>
        <LanguageToggle />
      </div>

      <Container className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-[rgba(14,165,233,0.18)] bg-vx-bg2 p-7 shadow-vx-glow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-vx-ink">{t.auth.login.title}</h1>
          <p className="mt-2 text-sm text-vx-muted">{t.auth.login.subtitle}</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
