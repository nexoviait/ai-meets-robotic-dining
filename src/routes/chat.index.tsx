import { createFileRoute } from "@tanstack/react-router";

// A new chat. The /chat layout renders the page; this route only marks the "new chat" state.
export const Route = createFileRoute("/chat/")({});
