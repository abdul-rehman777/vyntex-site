import { z } from "zod";
import { ORDER_TYPES } from "@/lib/order-types";

/**
 * Checkout validation.
 *
 * NOTE WHAT IS ABSENT: there is no price, amount, or total field. The client
 * cannot propose what something costs. It sends an order type and a service
 * key; the server resolves the amount from lib/pricing.ts (see lib/orders.ts).
 * Adding a client-supplied amount here would be a security regression.
 */

export interface CheckoutMessages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  consent: string;
  selectService: string;
}

export const defaultCheckoutMessages: CheckoutMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  invalidPhone: "Enter a valid phone number.",
  consent: "Please provide your consent to continue.",
  selectService: "Please select a service.",
};

const phoneRe = /^[+()\-\s\d]{7,20}$/;

/** Public / direct checkout: buyer details + terms acceptance. */
export function makeCheckoutSchema(m: CheckoutMessages = defaultCheckoutMessages) {
  return z.object({
    orderType: z.literal("direct"),
    serviceKey: z.string().trim().min(1, m.selectService).max(60),
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
    notes: z.string().trim().max(2000).optional().default(""),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    privacyAccepted: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const checkoutSchema = makeCheckoutSchema();
export type CheckoutInput = z.infer<typeof checkoutSchema>;

/**
 * Partner wholesale order. `clientReference` is a free-text label the partner
 * uses to recognize the order (e.g. "Acme Bakery - homepage"). We deliberately
 * do NOT collect the end client's name, email, phone, or address: VYNTEX has no
 * business need for the partner's client's personal data, and not collecting it
 * is the strongest possible protection for it.
 */
export interface PartnerOrderMessages {
  required: string;
  selectService: string;
  consent: string;
}

export const defaultPartnerOrderMessages: PartnerOrderMessages = {
  required: "This field is required.",
  selectService: "Please select a service.",
  consent: "Please provide your consent to continue.",
};

export function makePartnerOrderSchema(
  m: PartnerOrderMessages = defaultPartnerOrderMessages,
) {
  return z.object({
    orderType: z.literal("partner_wholesale"),
    serviceKey: z.string().trim().min(1, m.selectService).max(60),
    clientReference: z.string().trim().min(2, m.required).max(160),
    notes: z.string().trim().max(2000).optional().default(""),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const partnerOrderSchema = makePartnerOrderSchema();
export type PartnerOrderInput = z.infer<typeof partnerOrderSchema>;

/** Activation / renewal: no payload beyond the order type. Amount is fixed server-side. */
export const activationSchema = z.object({
  orderType: z.enum(["reseller_activation", "reseller_renewal"]),
  language: z.enum(["en", "es"]).default("en"),
});
export type ActivationInput = z.infer<typeof activationSchema>;

/** Discriminated union covering every /api/checkout/create payload. */
export const createCheckoutSchema = z.discriminatedUnion("orderType", [
  checkoutSchema,
  partnerOrderSchema,
  z.object({
    orderType: z.literal("reseller_activation"),
    language: z.enum(["en", "es"]).default("en"),
  }),
  z.object({
    orderType: z.literal("reseller_renewal"),
    language: z.enum(["en", "es"]).default("en"),
  }),
]);
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

/** Runtime guard used by the route so ORDER_TYPES stays the single list. */
export function isOrderType(value: string): boolean {
  return (ORDER_TYPES as readonly string[]).includes(value);
}
