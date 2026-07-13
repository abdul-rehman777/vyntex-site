import { z } from "zod";

/**
 * Contact form validation. Option VALUES are canonical, language-independent
 * tokens (forms render translated labels mapped to these), so the server can
 * validate against a fixed enum regardless of UI language.
 *
 * `make*Schema(messages)` lets the client build the schema with translated
 * messages while the server uses the English defaults exported below.
 */

export const CONTACT_SERVICES = [
  "website",
  "ai_automation",
  "ai_chatbot",
  "crm",
  "branding",
  "digital_marketing",
  "social_media",
  "reseller",
  "other",
] as const;

export const CONTACT_PREFERRED = ["email", "phone", "text", "whatsapp"] as const;

export const MESSAGE_MIN = 20;

const phoneRe = /^[+()\-\s\d]{7,20}$/;

export interface ContactMessages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  minMessage: string;
  consent: string;
  selectService: string;
}

export const defaultContactMessages: ContactMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  invalidPhone: "Enter a valid phone number.",
  minMessage: `Please use at least ${MESSAGE_MIN} characters.`,
  consent: "Please provide your consent to continue.",
  selectService: "Please select a service.",
};

export function makeContactSchema(m: ContactMessages = defaultContactMessages) {
  return z.object({
    fullName: z.string().trim().min(1, m.required).max(120),
    businessName: z.string().trim().max(160).optional().default(""),
    email: z.string().trim().email(m.invalidEmail).max(180),
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .default("")
      .refine((v) => v === "" || phoneRe.test(v), m.invalidPhone),
    serviceInterest: z.enum(CONTACT_SERVICES, {
      errorMap: () => ({ message: m.selectService }),
    }),
    preferredContact: z.enum(CONTACT_PREFERRED).default("email"),
    message: z.string().trim().min(MESSAGE_MIN, m.minMessage).max(5000),
    consent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const contactSchema = makeContactSchema();
export type ContactInput = z.infer<typeof contactSchema>;
