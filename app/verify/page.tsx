"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import Container from "@/components/ui/Container";
import LanguageToggle from "@/components/ui/LanguageToggle";
import VerifyForm from "@/components/auth/VerifyForm";

function VerifyInner() {
  const { t } = useLang();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  return (
    <div className="w-full max-w-md rounded-2xl border border-[rgba(14,165,233,0.18)] bg-vx-bg2 p-7 shadow-vx-glow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-vx-ink">{t.auth.verify.title}</h1>
      {email ? (
        <>
          <p className="mt-2 text-sm text-vx-muted">
            {t.auth.verify.subtitle.replace("{email}", email)}
          </p>
          <div className="mt-6">
            <VerifyForm email={email} />
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-vx-muted">
          {t.auth.errors.missingEmail}{" "}
          <Link href="/login" className="text-vx-blue hover:text-vx-cyan">
            {t.auth.verify.changeEmail}
          </Link>
        </p>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-vx-ink">
          VYNTEX
        </Link>
        <LanguageToggle />
      </div>
      <Container className="flex flex-1 items-center justify-center py-12">
        <Suspense fallback={null}>
          <VerifyInner />
        </Suspense>
      </Container>
    </main>
  );
}
