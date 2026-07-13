import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getPartnerForUser } from "@/lib/reseller";
import {
  storeClientFile,
  isAllowedMime,
  safeFileName,
  MAX_FILE_BYTES,
} from "@/lib/files";
import { limiters } from "@/lib/rate-limit";
import { notifyFormSubmit } from "@/lib/formsubmit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Result = { ok: true; id: string } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Authenticated client file upload to a PRIVATE Supabase Storage bucket.
 *
 * Validation is an ALLOWLIST of MIME types, checked server-side. The browser's
 * `accept` attribute is a convenience, not a control — it is trivially bypassed,
 * so it is re-checked here where it counts.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return json({ ok: false, code: "session" }, 401);

  const rl = await limiters.fileUpload().limit(`user:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: "validation" }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return json({ ok: false, code: "validation" }, 400);

  if (file.size === 0) return json({ ok: false, code: "empty_file" }, 400);
  if (file.size > MAX_FILE_BYTES) return json({ ok: false, code: "file_too_large" }, 413);
  if (!isAllowedMime(file.type)) return json({ ok: false, code: "file_type" }, 415);

  const bytes = await file.arrayBuffer();

  // Double-check the decoded length: `file.size` is client-reported metadata.
  if (bytes.byteLength > MAX_FILE_BYTES) {
    return json({ ok: false, code: "file_too_large" }, 413);
  }

  const partner = await getPartnerForUser(user);

  const stored = await storeClientFile({
    userId: user.id,
    partnerId: partner?.id ?? null,
    fileName: safeFileName(file.name),
    mimeType: file.type,
    bytes,
  });

  if (!stored.ok) return json({ ok: false, code: stored.code }, 500);

  const formSubmit = await notifyFormSubmit({
    formName: "Client File Upload",
    subject: `New VYNTEX client file uploaded by ${user.email ?? user.id}`,
    replyTo: user.email,
    fields: {
      "User ID": user.id,
      Email: user.email,
      "File Record ID": stored.id,
      Filename: safeFileName(file.name),
      "MIME Type": file.type,
      "Size (bytes)": bytes.byteLength,
      "Partner ID": partner?.id,
    },
  });
  if (!formSubmit.ok) {
    console.error("[files/upload] FormSubmit notification failed:", formSubmit.error);
  }

  return json({ ok: true, id: stored.id });
}
