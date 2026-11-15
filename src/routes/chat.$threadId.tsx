import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Concierge — AI HUB BD" },
      {
        name: "description",
        content:
          "Ask AI HUB BD's bilingual concierge about workstations, discovery sessions, robotic café, packages and investment.",
      },
      { property: "og:title", content: "AI HUB BD AI Concierge" },
      {
        property: "og:description",
        content: "Explore AI HUB BD with an English and Bangla concierge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});
function ChatPage() {
  const { t } = useLang();
  return (
    <PageHeader
      kicker="AI HUB BD"
      title={t("AI Concierge", "এআই কনসিয়ার্জ")}
      sub={t(
        "Ideas, workstations, food and your next visit.",
        "আইডিয়া, ওয়ার্কস্টেশন, খাবার এবং আপনার পরবর্তী ভ্রমণ।",
      )}
    />
  );
}
