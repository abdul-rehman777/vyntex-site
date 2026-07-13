import { z } from "zod";

/** Support request validation (portal, authenticated). */

export interface SupportMessages {
  subjectRequired: string;
  messageMin: string;
}

export const SUPPORT_MESSAGE_MIN = 10;

export const defaultSupportMessages: SupportMessages = {
  subjectRequired: "Please enter a subject.",
  messageMin: `Please use at least ${SUPPORT_MESSAGE_MIN} characters.`,
};

export function makeSupportSchema(m: SupportMessages = defaultSupportMessages) {
  return z.object({
    subject: z.string().trim().min(3, m.subjectRequired).max(160),
    message: z.string().trim().min(SUPPORT_MESSAGE_MIN, m.messageMin).max(5000),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const supportSchema = makeSupportSchema();
export type SupportInput = z.infer<typeof supportSchema>;
