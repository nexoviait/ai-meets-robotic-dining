import { describe, it, expect } from "vitest";
import { nextScrollTop, scrollPercent } from "@/lib/scroll-keys";
describe("menu scroll keys", () => {
  it("arrows step a line", () => {
    expect(nextScrollTop("ArrowDown", 0, 300, 500)).toBe(40);
    expect(nextScrollTop("ArrowUp", 20, 300, 500)).toBe(0);
  });
  it("page keys step 90% viewport", () => expect(nextScrollTop("PageDown", 0, 300, 500)).toBe(270));
  it("home/end jump", () => {
    expect(nextScrollTop("Home", 200, 300, 500)).toBe(0);
    expect(nextScrollTop("End", 0, 300, 500)).toBe(500);
  });
  it("ignores other keys", () => expect(nextScrollTop("a", 0, 300, 500)).toBeNull());
  it("percent", () => expect(scrollPercent(250, 500)).toBe(50));
});
