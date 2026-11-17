import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { ChatApp, ChatSkeleton } from "@/components/chat/ChatApp";
import { ASSISTANT } from "@/lib/data";

// Layout for /chat and /chat/$threadId. Both render the same ChatApp, so a new chat moving to its
// /chat/$threadId address keeps its conversation mounted. Chats live in browser storage, so the
// app renders on the client only.
export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: `${ASSISTANT.name} — AI HUB BD` },
      {
        name: "description",
        content: `Chat with ${ASSISTANT.name}, AI HUB BD's bilingual AI assistant: business ideas, image and video prompts, jingles, workstations, the robotic café, packages and investment.`,
      },
      { property: "og:title", content: `${ASSISTANT.name} — AI HUB BD's AI assistant` },
      {
        property: "og:description",
        content: "Turn your idea into a business with an English and Bangla AI assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <ClientOnly fallback={<ChatSkeleton />}>
      <ChatApp />
    </ClientOnly>
  );
}
