import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "@/components/portal/PortalShell";
import FileManager, { type ClientFileView } from "@/components/files/FileManager";

export const metadata: Metadata = {
  title: "Files",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Client file exchange. RLS scopes the query to the caller's own files, so a
 * crafted request cannot list anyone else's documents.
 */
export default async function FilesPage() {
  const user = await requireUser();

  let files: ClientFileView[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("client_files")
      .select("id, file_name, size_bytes, created_at, direction")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      files = data.map((r) => ({
        id: r.id as string,
        fileName: r.file_name as string,
        sizeBytes: r.size_bytes as number,
        createdAt: r.created_at as string,
        direction: (r.direction as "upload" | "deliverable") ?? "upload",
      }));
    }
  } catch {
    /* empty state handles it */
  }

  return (
    <PortalShell page="files">
      <FileManager files={files} />
    </PortalShell>
  );
}
