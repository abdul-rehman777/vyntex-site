import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Client file exchange. SERVER ONLY.
 *
 * The bucket is PRIVATE with no storage policies, so only the service-role key
 * can touch objects — the server is the only way in or out, and it checks
 * ownership first. Files are never served from a public URL; they are handed
 * out as short-lived signed URLs.
 *
 * Uploads are validated against an allowlist (not a blocklist). A blocklist of
 * "dangerous" extensions is always one entry short; an allowlist of the formats
 * a client would actually send us is closed by construction.
 */

export const FILES_BUCKET = "client-files";

/** 15 MB. Comfortably inside Vercel's 4.5 MB body limit? No — see note below. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;

/**
 * Vercel's serverless functions cap the request body at ~4.5 MB. We cap at 4 MB
 * so a legitimate upload never dies at the platform edge with an opaque 413.
 * Larger files should be sent by email or a link — which the UI says plainly
 * rather than letting a 20 MB upload fail silently after a long spinner.
 */

export const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/zip": "zip",
};

export function isAllowedMime(mime: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWED_MIME, mime);
}

/**
 * Strips path separators, control characters, and leading dots from a filename.
 * The stored path never uses the client's name anyway (we generate a UUID path),
 * but the display name is echoed back into HTML, so it gets cleaned too.
 */
export function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[/\\]/g, "-")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/^\.+/, "")
    .trim();
  return (cleaned || "file").slice(0, 120);
}

export type StoreFileResult =
  | { ok: true; id: string; path: string }
  | { ok: false; code: "server" | "storage" };

export async function storeClientFile(input: {
  userId: string;
  partnerId: string | null;
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
}): Promise<StoreFileResult> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, code: "server" };

  const ext = ALLOWED_MIME[input.mimeType] ?? "bin";
  // The stored path is namespaced by user id and randomly named. A user cannot
  // guess another user's object path, and cannot traverse out of their own
  // prefix by crafting a filename — the filename is not used in the path.
  const objectId = globalThis.crypto.randomUUID();
  const path = `${input.userId}/${objectId}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from(FILES_BUCKET)
    .upload(path, input.bytes, {
      contentType: input.mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error("[files] upload failed:", uploadError.message);
    return { ok: false, code: "storage" };
  }

  const { data, error } = await admin
    .from("client_files")
    .insert({
      user_id: input.userId,
      partner_id: input.partnerId,
      file_name: safeFileName(input.fileName),
      storage_path: path,
      mime_type: input.mimeType,
      size_bytes: input.bytes.byteLength,
      direction: "upload",
      uploaded_by: "client",
    })
    .select("id")
    .single();

  if (error || !data) {
    // Roll back the object so we never leave an orphan the DB doesn't know about.
    await admin.storage.from(FILES_BUCKET).remove([path]);
    console.error("[files] metadata insert failed:", error?.message);
    return { ok: false, code: "server" };
  }

  return { ok: true, id: data.id as string, path };
}

/**
 * Short-lived signed URL for a file the caller OWNS.
 * Ownership is resolved from the session, never from the request — passing
 * someone else's file id returns null, not their document.
 */
export async function signedFileUrl(input: {
  userId: string;
  fileId: string;
  expiresInSeconds?: number;
}): Promise<{ url: string; fileName: string } | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data: file } = await admin
    .from("client_files")
    .select("storage_path, file_name, user_id")
    .eq("id", input.fileId)
    .maybeSingle();

  if (!file) return null;
  // The ownership check. This is the whole security of the download route.
  if (file.user_id !== input.userId) return null;

  const { data, error } = await admin.storage
    .from(FILES_BUCKET)
    .createSignedUrl(file.storage_path as string, input.expiresInSeconds ?? 300);

  if (error || !data) return null;
  return { url: data.signedUrl, fileName: file.file_name as string };
}
