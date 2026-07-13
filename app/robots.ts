import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Protected and transactional areas are never indexed. /portal/partner
        // can render confidential wholesale pricing for an authorized partner,
        // so it is excluded here AND marked noindex in its page metadata AND
        // gated server-side — three independent layers, none of which is the
        // actual security boundary (that is getPartnerAccess).
        disallow: [
          "/api/",
          "/portal/",
          "/login",
          "/verify",
          "/checkout/success",
          "/checkout/cancel",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
