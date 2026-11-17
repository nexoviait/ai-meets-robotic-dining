import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { ASSISTANT } from "@/lib/data";
import { OPEN_EVENT } from "@/lib/concierge-open";
import avatar from "@/assets/concierge.png";

/**
 * Floating shortcut to the full-page assistant on every other page. It also answers
 * openConcierge(), so any page can open the chat (optionally with a guided workflow).
 */
export function ChatLauncher({ onChatPage }: { onChatPage: boolean }) {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  useEffect(() => {
    // On the chat page the open conversation picks up workflows itself.
    if (onChatPage) return;
    const open = () => void navigate({ to: "/chat" });
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, [navigate, onChatPage]);
  if (onChatPage) return null;
  const name = lang === "bn" ? ASSISTANT.nameBn : ASSISTANT.name;
  return (
    <Link
      to="/chat"
      className="no-print fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-primary pl-2 pr-5 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={t(`Chat with ${name}`, `${name}-এর সাথে চ্যাট করুন`)}
    >
      <img src={avatar} width={40} height={40} alt="" className="h-10 w-10" />
      <span>{name}</span>
    </Link>
  );
}
