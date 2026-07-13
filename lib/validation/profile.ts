import { z } from "zod";

/** Profile update validation (portal). */

const phoneRe = /^[+()\-\s\d]{7,20}$/;

export interface ProfileMessages {
  required: string;
  invalidPhone: string;
}

export const defaultProfileMessages: ProfileMessages = {
  required: "This field is required.",
  invalidPhone: "Enter a valid phone number.",
};

export function makeProfileSchema(m: ProfileMessages = defaultProfileMessages) {
  return z.object({
    fullName: z.string().trim().min(1, m.required).max(120),
    businessName: z.string().trim().max(160).optional().default(""),
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .default("")
      .refine((v) => v === "" || phoneRe.test(v), m.invalidPhone),
    preferredLanguage: z.enum(["en", "es"]),
  });
}

export const profileSchema = makeProfileSchema();
export type ProfileInput = z.infer<typeof profileSchema>;
