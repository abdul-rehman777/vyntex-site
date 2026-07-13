import { z } from "zod";

/**
 * Reseller application + agreement signature validation.
 *
 * Option VALUES are canonical, language-independent tokens so the server
 * validates against a fixed enum no matter which language the UI is in
 * (identical pattern to lib/validation/contact.ts).
 */

export const RESELL_MODELS = [
  "add_on_service", // bolt onto an existing service business
  "agency", // agency / marketing shop
  "referral", // refer and hand off
  "white_label", // resell fully under own brand
  "other",
] as const;

export const RESELLER_SERVICES = [
  "websites",
  "ai_automation",
  "crm",
  "branding",
  "social_media",
  "digital_marketing",
] as const;

export const CLIENT_COUNTS = ["0", "1_10", "11_50", "51_200", "200_plus"] as const;

export const APPLICATION_MESSAGE_MIN = 20;

const phoneRe = /^[+()\-\s\d]{7,20}$/;
// Optional website: accept bare domains as well as full URLs.
const websiteRe = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i;
const stateRe = /^[A-Za-z]{2}$/;

export interface ResellerMessages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  invalidWebsite: string;
  invalidState: string;
  minMessage: string;
  consent: string;
  selectAtLeastOne: string;
  selectOne: string;
}

export const defaultResellerMessages: ResellerMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  invalidPhone: "Enter a valid phone number.",
  invalidWebsite: "Enter a valid website address.",
  invalidState: "Use the two-letter state code (e.g. NJ).",
  minMessage: `Please use at least ${APPLICATION_MESSAGE_MIN} characters.`,
  consent: "Please provide your consent to continue.",
  selectAtLeastOne: "Please select at least one option.",
  selectOne: "Please select an option.",
};

export function makeResellerApplicationSchema(
  m: ResellerMessages = defaultResellerMessages,
) {
  return z.object({
    fullName: z.string().trim().min(1, m.required).max(120),
    businessName: z.string().trim().min(1, m.required).max(160),
    email: z.string().trim().email(m.invalidEmail).max(180),
    phone: z.string().trim().min(1, m.required).max(40).refine((v) => phoneRe.test(v), m.invalidPhone),
    website: z
      .string()
      .trim()
      .max(200)
      .optional()
      .default("")
      .refine((v) => v === "" || websiteRe.test(v), m.invalidWebsite),
    city: z.string().trim().min(1, m.required).max(80),
    state: z.string().trim().length(2, m.invalidState).refine((v) => stateRe.test(v), m.invalidState),
    clientCount: z.enum(CLIENT_COUNTS, {
      errorMap: () => ({ message: m.selectOne }),
    }),
    servicesInterest: z
      .array(z.enum(RESELLER_SERVICES))
      .min(1, m.selectAtLeastOne),
    resellModel: z.enum(RESELL_MODELS, {
      errorMap: () => ({ message: m.selectOne }),
    }),
    message: z.string().trim().min(APPLICATION_MESSAGE_MIN, m.minMessage).max(5000),
    agreementAck: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    privacyConsent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const resellerApplicationSchema = makeResellerApplicationSchema();
export type ResellerApplicationInput = z.infer<typeof resellerApplicationSchema>;

// ---------------------------------------------------------------------------
// Agreement signature
// ---------------------------------------------------------------------------

export interface SignatureMessages {
  required: string;
  invalidEmail: string;
  consent: string;
  nameMismatch: string;
}

export const defaultSignatureMessages: SignatureMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  consent: "Please provide your consent to continue.",
  nameMismatch: "Your typed signature must match your full legal name exactly.",
};

/**
 * The typed signature must exactly match the full legal name (case- and
 * whitespace-insensitive). This is what makes the typed name a deliberate act
 * rather than an accidental checkbox.
 */
export function makeSignatureSchema(m: SignatureMessages = defaultSignatureMessages) {
  return z
    .object({
      fullLegalName: z.string().trim().min(2, m.required).max(140),
      legalBusinessName: z.string().trim().min(2, m.required).max(160),
      signerTitle: z.string().trim().min(1, m.required).max(120),
      email: z.string().trim().email(m.invalidEmail).max(180),
      typedSignature: z.string().trim().min(2, m.required).max(140),
      agreementAccepted: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
      signatureConsent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
      language: z.enum(["en", "es"]).default("en"),
      honeypot: z.string().optional().default(""),
      startedAt: z.number().optional(),
    })
    .refine(
      (v) =>
        v.typedSignature.trim().replace(/\s+/g, " ").toLowerCase() ===
        v.fullLegalName.trim().replace(/\s+/g, " ").toLowerCase(),
      { message: m.nameMismatch, path: ["typedSignature"] },
    );
}

export const signatureSchema = makeSignatureSchema();
export type SignatureInput = z.infer<typeof signatureSchema>;
