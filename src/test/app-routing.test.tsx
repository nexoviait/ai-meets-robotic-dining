import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("opens the full-page assistant for a new chat and for a saved chat", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const fresh = router.matchRoutes("/chat").map((m) => m.routeId);
    const saved = router.matchRoutes("/chat/abc-123");

    expect(fresh).toEqual(expect.arrayContaining(["/chat", "/chat/"]));
    expect(saved.map((m) => m.routeId)).toEqual(
      expect.arrayContaining(["/chat", "/chat/$threadId"]),
    );
    expect(saved.at(-1)?.params).toMatchObject({ threadId: "abc-123" });
  });
});
