import { describe, expect, it } from "vitest";
import { quoteSchema } from "@/lib/quote.functions";

const valid = { full_name: "Ali Hassan", phone: "+966 500 000 000", email: "a@b.com", equipment: "telehandler-17m", location: "Riyadh" };

describe("quote request validation", () => {
  it("accepts a complete request", () => expect(quoteSchema.safeParse(valid).success).toBe(true));
  it("rejects an invalid email", () => expect(quoteSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false));
  it("requires equipment to be chosen", () => expect(quoteSchema.safeParse({ ...valid, equipment: "" }).success).toBe(false));
  it("rejects a phone with letters", () => expect(quoteSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false));
});
