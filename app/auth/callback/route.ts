import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Handles the magic-link path: if the user clicks the email link instead of
 * typing the code, Supabase redirects here with a `code` to exchange for a
 * session. The code-entry flow (/verify) does not use this route.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (code) {
    try {
      const supabase = await getSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}/portal`);
      }
      console.error("[auth/callback] exchange failed:", error.message);
    } catch (err) {
      console.error("[auth/callback] error:", err);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
