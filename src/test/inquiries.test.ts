import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/inquiry-schema";

describe("Inquiry intake", () => {
  const input = { kind: "General", name: "Test visitor", email: "test@example.com", message: "A test inquiry" };
  it.each(["contact", "investor", "business"])("accepts %s inquiries", (source) => {
    expect(inquirySchema.parse({ ...input, source }).source).toBe(source);
  });
  it("rejects invalid contact details and unsupported sources", () => {
    expect(inquirySchema.safeParse({ ...input, source: "contact", email: "invalid" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...input, source: "other" }).success).toBe(false);
  });
});