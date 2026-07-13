import { describe, it, expect } from "vitest";
import { translations } from "@/lib/translations";

/**
 * Bilingual parity.
 *
 * The `const es: Dict = {...}` pattern already makes a missing key a COMPILE
 * error. These tests catch what the type system cannot: a key that exists but
 * was never actually translated (copy-pasted English left in the Spanish tree),
 * and arrays whose lengths drifted apart.
 */

type Node = Record<string, unknown>;

function flatten(obj: Node, prefix = "", out: Record<string, unknown> = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value as Node, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

const en = flatten(translations.en as unknown as Node);
const es = flatten(translations.es as unknown as Node);

describe("translations", () => {
  it("has identical key sets in both languages", () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it("has matching array lengths for every list", () => {
    for (const key of Object.keys(en)) {
      const a = en[key];
      const b = es[key];
      if (Array.isArray(a)) {
        expect(Array.isArray(b), `${key} should be an array in ES`).toBe(true);
        expect((b as unknown[]).length, `${key} length`).toBe(a.length);
      }
    }
  });

  it("has no empty strings", () => {
    for (const [key, value] of Object.entries(en)) {
      if (typeof value === "string") {
        expect(value.trim().length, `en.${key} is empty`).toBeGreaterThan(0);
      }
    }
    for (const [key, value] of Object.entries(es)) {
      if (typeof value === "string") {
        expect(value.trim().length, `es.${key} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("preserves every interpolation placeholder across languages", () => {
    // If EN says "{fee}" and ES forgot it, the Spanish UI would render a
    // sentence with a missing price. The type system cannot see this.
    const placeholder = /\{(\w+)\}/g;
    for (const key of Object.keys(en)) {
      const a = en[key];
      const b = es[key];
      if (typeof a !== "string" || typeof b !== "string") continue;

      const enTokens = [...a.matchAll(placeholder)].map((m) => m[1]).sort();
      const esTokens = [...b.matchAll(placeholder)].map((m) => m[1]).sort();
      expect(esTokens, `placeholders differ at ${key}`).toEqual(enTokens);
    }
  });

  it("does not leave English text untranslated in the Spanish tree", () => {
    // Sample the long-form copy: identical long strings are almost certainly a
    // copy-paste, not a coincidence. Short strings ("CRM", "VYNTEX", "$199")
    // are legitimately identical, so they are excluded.
    const suspicious: string[] = [];
    const allowed = new Set(["chat.topics.contact"]);

    for (const key of Object.keys(en)) {
      const a = en[key];
      const b = es[key];
      if (typeof a !== "string" || typeof b !== "string") continue;
      if (a.length < 40) continue;
      if (allowed.has(key)) continue;
      if (a === b) suspicious.push(key);
    }
    expect(suspicious).toEqual([]);
  });
});
