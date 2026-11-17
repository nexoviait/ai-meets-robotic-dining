import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import {
  MAX_PART_CHARS,
  MAX_REQUEST_MESSAGES,
  trimHistoryForRequest,
} from "@/lib/concierge-history";
import { conciergeRequest } from "@/lib/concierge";

const msg = (i: number, text = `m${i}`): UIMessage => ({
  id: String(i),
  role: i % 2 === 0 ? "user" : "assistant",
  parts: [{ type: "text", text }],
});

describe("concierge request history", () => {
  it("sends only recent turns, starting with a visitor message", () => {
    const long = Array.from({ length: 101 }, (_, i) => msg(i));
    const trimmed = trimHistoryForRequest(long);
    expect(trimmed.length).toBeLessThanOrEqual(MAX_REQUEST_MESSAGES);
    expect(trimmed[0]?.role).toBe("user");
    expect(trimmed.at(-1)?.id).toBe("100");
  });
  it("keeps oversized replies within the server's validation limits", () => {
    const history = [msg(0), msg(1, "x".repeat(MAX_PART_CHARS + 500)), msg(2)];
    const body = { id: "t", lang: "en", messages: trimHistoryForRequest(history) };
    expect(conciergeRequest.safeParse(body).success).toBe(true);
  });
  it("leaves short threads untouched", () => {
    const history = [msg(0), msg(1), msg(2)];
    expect(trimHistoryForRequest(history)).toEqual(history);
  });
});

describe("chat history", () => {
  it("creates a thread on its first message, titled from the visitor's text", async () => {
    const { saveThread } = await import("@/lib/concierge-history");
    const saved = saveThread([], "a", [msg(0, "Plan a tea stall business")]);
    expect(saved).toEqual([
      {
        id: "a",
        title: "Plan a tea stall business",
        messages: [msg(0, "Plan a tea stall business")],
      },
    ]);
  });
  it("lists the most recently active conversation first and hides empty drafts", async () => {
    const { saveThread, recentThreads } = await import("@/lib/concierge-history");
    let threads = saveThread([], "a", [msg(0, "first")]);
    threads = saveThread(threads, "b", [msg(0, "second")]);
    threads = saveThread(threads, "a", [msg(0, "first"), msg(1)]);
    threads.push({ id: "empty", title: "AI Concierge", messages: [] });
    expect(recentThreads(threads).map((t) => t.id)).toEqual(["a", "b"]);
  });
});
