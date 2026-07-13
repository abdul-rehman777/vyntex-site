import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Partner authorization state machine.
 *
 * getPartnerAccess() is the SINGLE gate for confidential wholesale pricing.
 * canViewWholesale must be true if and only if the partner is genuinely active:
 * approved, agreement signed, activation payment confirmed, and not expired,
 * suspended, or terminated.
 *
 * We mock the Supabase client so this runs with no live database, and assert on
 * the decision logic itself — which is the thing that actually protects the
 * price book.
 */

interface MockPartner {
  id: string;
  auth_user_id: string;
  partner_number: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: string;
  activation_date: string | null;
  expiration_date: string | null;
  annual_sales_count: number;
  minimum_sales_required: number;
  agreement_id: string | null;
  created_at: string;
  updated_at: string;
}

const FUTURE = new Date(Date.now() + 90 * 86_400_000).toISOString();
const PAST = new Date(Date.now() - 1 * 86_400_000).toISOString();

function partner(overrides: Partial<MockPartner>): MockPartner {
  return {
    id: "p1",
    auth_user_id: "u1",
    partner_number: "VTX-ABC123",
    business_name: "Partner Co",
    contact_name: "Jane Partner",
    email: "jane@partner.co",
    phone: null,
    status: "active",
    activation_date: PAST,
    expiration_date: FUTURE,
    annual_sales_count: 0,
    minimum_sales_required: 4,
    agreement_id: "a1",
    created_at: PAST,
    updated_at: PAST,
    ...overrides,
  };
}

const agreement = {
  id: "a1",
  partner_id: "p1",
  agreement_version: "2.0",
  agreement_hash: "deadbeef",
  agreement_language: "en",
  signed_name: "Jane Partner",
  signed_business_name: "Partner Co",
  signed_title: "Owner",
  signed_email: "jane@partner.co",
  signed_at: PAST,
  status: "signed",
  document_path: "p1/a1.pdf",
};

/** Builds a Supabase mock that returns the given partner + agreement. */
function mockSupabase(p: MockPartner | null, a: typeof agreement | null) {
  return {
    from(table: string) {
      const chain = {
        select: () => chain,
        eq: () => chain,
        order: () => chain,
        limit: () => chain,
        maybeSingle: async () => {
          if (table === "partners") return { data: p, error: null };
          if (table === "reseller_agreements") return { data: a, error: null };
          return { data: null, error: null };
        },
      };
      // The application-count query uses head:true and reads `.count`.
      if (table === "reseller_applications") {
        return { select: () => ({ eq: async () => ({ count: 0, error: null }) }) };
      }
      return chain;
    },
  };
}

async function accessFor(p: MockPartner | null, a: typeof agreement | null) {
  vi.resetModules();
  vi.doMock("@/lib/supabase/server", () => ({
    getSupabaseServerClient: async () => mockSupabase(p, a),
  }));
  const { getPartnerAccess } = await import("@/lib/reseller");
  const user = { id: "u1", email: "jane@partner.co" };
  // The real signature takes a Supabase User; only `id` is read.
  return getPartnerAccess(user as unknown as Parameters<typeof getPartnerAccess>[0]);
}

beforeEach(() => {
  vi.resetModules();
});

describe("getPartnerAccess — wholesale gate", () => {
  it("GRANTS access to a fully active partner", async () => {
    const result = await accessFor(partner({ status: "active" }), agreement);
    expect(result.state).toBe("active");
    expect(result.canViewWholesale).toBe(true);
  });

  it("DENIES a user with no partner record", async () => {
    const result = await accessFor(null, null);
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES a pending applicant", async () => {
    const result = await accessFor(partner({ status: "pending" }), null);
    expect(result.state).toBe("pending");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES an approved partner who has NOT signed the agreement", async () => {
    const result = await accessFor(partner({ status: "approved" }), null);
    expect(result.state).toBe("approved_unsigned");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES a signed partner who has NOT paid the activation", async () => {
    // Status is still 'approved' because only the verified Square webhook
    // promotes a partner to 'active'.
    const result = await accessFor(partner({ status: "approved" }), agreement);
    expect(result.state).toBe("signed_unpaid");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES a suspended partner", async () => {
    const result = await accessFor(partner({ status: "suspended" }), agreement);
    expect(result.state).toBe("suspended");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES a terminated partner", async () => {
    const result = await accessFor(partner({ status: "terminated" }), agreement);
    expect(result.state).toBe("terminated");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES a partner whose term has expired", async () => {
    const result = await accessFor(partner({ status: "expired" }), agreement);
    expect(result.state).toBe("expired");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES an 'active' row whose expiration date has silently passed", async () => {
    // THE IMPORTANT ONE. If the nightly cron failed to run, the row still says
    // 'active' — but the term is over. Access is computed at READ time, so the
    // partner is locked out anyway. The cron is bookkeeping, not the boundary.
    const result = await accessFor(
      partner({ status: "active", expiration_date: PAST }),
      agreement,
    );
    expect(result.state).toBe("expired");
    expect(result.canViewWholesale).toBe(false);
  });

  it("DENIES an 'active' partner with NO signed agreement (impossible state)", async () => {
    // Defence in depth: if a database edit ever produced this state, we fall
    // back to the signing step rather than unlocking the price book.
    const result = await accessFor(partner({ status: "active" }), null);
    expect(result.state).toBe("approved_unsigned");
    expect(result.canViewWholesale).toBe(false);
  });
});
