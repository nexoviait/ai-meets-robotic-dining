import { describe, expect, it } from "vitest";
import { WORKFLOWS, buildWorkflowPrompt, missingFields } from "@/lib/concierge-workflows";

describe("concierge workflows", () => {
  it("offers the four requested workflows", () => {
    expect(WORKFLOWS.map((w) => w.id)).toEqual(["business", "image", "video", "audio"]);
  });
  it("requires the key input before generating", () => {
    const biz = WORKFLOWS[0]!;
    expect(missingFields(biz, {})).toEqual(["skill"]);
    expect(missingFields(biz, { skill: "tailoring" })).toEqual([]);
  });
  it("includes the inputs and output template in the prompt", () => {
    const video = WORKFLOWS[2]!;
    const p = buildWorkflowPrompt(video, { product: "bakery", length: "30 seconds" }, "en");
    expect(p).toContain("bakery");
    expect(p).toContain("Scene | Time | Visual | Voiceover | On-screen text");
  });
});
