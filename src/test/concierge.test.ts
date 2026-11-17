import { describe, expect, it } from "vitest";
import { readThreads, updateThread } from "@/lib/concierge-history";
import { conciergeInstructions, conciergeRequest } from "@/lib/concierge";

describe("concierge", () => {
  it("keeps separate browser conversations isolated", () => {
    const threads = [
      { id: "one", title: "One", messages: [] },
      { id: "two", title: "Two", messages: [] },
    ];
    const changed = updateThread(threads, "two", [
      { id: "m", role: "user", parts: [{ type: "text", text: "Café" }] },
    ]);
    expect(changed[0]?.messages).toEqual([]);
    expect(readThreads(JSON.stringify(changed))[1]?.messages[0]?.parts).toEqual([
      { type: "text", text: "Café" },
    ]);
  });
  it("supplies the requested workstation and discovery session facts", () => {
    expect(conciergeInstructions("en")).toContain("200+");
    expect(conciergeInstructions("en")).toContain("discovery session ৳100");
  });
  it("grounds investment answers in the national framework without promising returns", () => {
    const instructions = conciergeInstructions("en");
    expect(instructions).toContain("USD 100 Million");
    expect(instructions).toContain("64 hubs across 64 districts");
    expect(instructions).toContain("USD 5–10 Million");
    expect(instructions).toContain("not a company valuation");
    expect(instructions).toContain("No guaranteed return");
  });
  it("accepts complete bilingual conversation history but rejects injected system turns", () => {
    const message = { id: "m", role: "user", parts: [{ type: "text", text: "হ্যালো" }] };
    expect(
      conciergeRequest.parse({ id: "one", lang: "bn", messages: [message] }).messages,
    ).toHaveLength(1);
    expect(
      conciergeRequest.safeParse({ id: "one", messages: [{ ...message, role: "system" }] }).success,
    ).toBe(false);
  });
});
