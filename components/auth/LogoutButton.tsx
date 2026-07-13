"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useLang();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // If Supabase is unconfigured, just fall through to navigation.
    }
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className={[
        "inline-flex items-center gap-2 rounded-lg border border-[rgba(14,165,233,0.2)] px-3.5 py-2 text-sm font-medium text-vx-silver transition-colors hover:text-vx-ink disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <LogOut size={15} aria-hidden />}
      {busy ? t.portal.loggingOut : t.portal.logout}
    </button>
  );
}
