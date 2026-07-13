import { z } from "zod";
import { CONTACT_SERVICES } from "@/lib/validation/contact";

/**
 * Consultation validation. Reuses the canonical service tokens from the contact
 * schema (same 9 services). Budget, timeline, and contact-method values are
 * canonical tokens rendered with translated labels in the UI.
 */

export const CONSULT_SERVICES = CONTACT_SERVICES;

export const CONSULT_BUDGETS = [
  "under_500",
  "500_1500",
  "1500_5000",
  "5000_10000",
  "10000_plus",
  "unsure",
] as const;

export const CONSULT_TIMELINES = [
  "asap",
  "2_4_weeks",
  "1_3_months",
  "planning",
] as const;

export const CONSULT_PREFERRED = [
  "email",
  "phone",
  "text",
  "whatsapp",
  "video",
] as const;

export const CONSULT_MESSAGE_MIN = 10;

const phoneRe = /^[+()\-\s\d]{7,20}$/;

export interface ConsultationMessages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  minMessage: string;
  consent: string;
  selectAtLeastOne: string;
  selectOne: string;
}

export const defaultConsultationMessages: ConsultationMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  invalidPhone: "Enter a valid phone number.",
  minMessage: `Please use at least ${CONSULT_MESSAGE_MIN} characters.`,
  consent: "Please provide your consent to continue.",
  selectAtLeastOne: "Please select at least one option.",
  selectOne: "Please select one.",
};

export function makeConsultationSchema(
  m: ConsultationMessages = defaultConsultationMessages,
) {
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
    services: z.array(z.enum(CONSULT_SERVICES)).min(1, m.selectAtLeastOne),
    budget: z.enum(CONSULT_BUDGETS, { errorMap: () => ({ message: m.selectOne }) }),
    timeline: z.enum(CONSULT_TIMELINES, { errorMap: () => ({ message: m.selectOne }) }),
    preferredContact: z.enum(CONSULT_PREFERRED, {
      errorMap: () => ({ message: m.selectOne }),
    }),
    referralSource: z.string().trim().max(200).optional().default(""),
    message: z.string().trim().min(CONSULT_MESSAGE_MIN, m.minMessage).max(5000),
    consent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const consultationSchema = makeConsultationSchema();
export type ConsultationInput = z.infer<typeof consultationSchema>;
