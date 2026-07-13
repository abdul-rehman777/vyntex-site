"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/profile";
import { notifyFormSubmit } from "@/lib/formsubmit";

export interface ProfileActionState {
  ok: boolean;
  error?: string;
}

/**
 * Updates the signed-in user's profile. RLS ensures a user can only update
 * their own row. Validated server-side with Zod; the client never bypasses it.
 */
export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await getUser();
  if (!user) return { ok: false, error: "session" };

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    businessName: formData.get("businessName"),
    phone: formData.get("phone"),
    preferredLanguage: formData.get("preferredLanguage"),
  });
  if (!parsed.success) return { ok: false, error: "validation" };
  const data = parsed.data;

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: data.fullName,
      business_name: data.businessName || null,
      phone: data.phone || null,
      preferred_language: data.preferredLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (error) {
    console.error("[portal] profile update failed:", error.message);
    return { ok: false, error: "server" };
  }

  const formSubmit = await notifyFormSubmit({
    formName: "Client Profile Update",
    subject: `VYNTEX client profile updated by ${data.fullName}`,
    replyTo: user.email,
    fields: {
      "User ID": user.id,
      Email: user.email,
      Name: data.fullName,
      Business: data.businessName,
      Phone: data.phone,
      "Preferred Language": data.preferredLanguage,
    },
  });
  if (!formSubmit.ok) {
    console.error("[portal] FormSubmit notification failed:", formSubmit.error);
  }

  revalidatePath("/portal");
  return { ok: true };
}
