import { createFileRoute } from "@tanstack/react-router";

// A saved chat. The /chat layout renders the page; conversations live only in the visitor's
// browser, so these addresses are kept out of search results.
export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
});
