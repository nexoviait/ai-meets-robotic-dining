import { ClientOnly, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  CalendarDays,
  History,
  Plus,
  Trash2,
  UtensilsCrossed,
  X,
  Languages,
  Copy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageAction,
  MessageActions,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useLang } from "@/lib/i18n";
import {
  HISTORY_KEY,
  readThreads,
  updateThread,
  type ConciergeThread,
} from "@/lib/concierge-history";
import { ConciergeTools, ReadAloudToggle, VoiceInputButton, speak } from "./ConciergeTools";
import { useLocalStorage } from "@/lib/storage";
import { WorkflowPanel } from "./WorkflowPanel";
import type { Workflow } from "@/lib/concierge-workflows";
import avatar from "@/assets/concierge.png";

export function ConciergeWidget() {
  return (
    <ClientOnly fallback={null}>
      <Concierge />
    </ClientOnly>
  );
}

function Concierge() {
  const { t, lang, setLang } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const routeId = path.match(/^\/chat\/([^/]+)\/?$/)?.[1];
  const navigate = useNavigate();
  const previous = useRef("/");
  const [threads, setThreads] = useState<ConciergeThread[]>(() => {
    const saved = readThreads(localStorage.getItem(HISTORY_KEY));
    if (routeId && !saved.some((thread) => thread.id === routeId)) {
      const next = [...saved, { id: routeId, title: "AI Concierge", messages: [] }];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    }
    return saved;
  });
  const [history, setHistory] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const active = threads.find((thread) => thread.id === routeId);
  const change = useCallback((updater: (current: ConciergeThread[]) => ConciergeThread[]) => {
    setThreads((current) => {
      const next = updater(current);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        setStorageError(true);
      }
      return next;
    });
  }, []);
  const save = useCallback(
    (id: string, messages: UIMessage[]) => change((current) => updateThread(current, id, messages)),
    [change],
  );
  const go = (id: string) => {
    setHistory(false);
    void navigate({ to: "/chat/$threadId", params: { threadId: id } });
  };
  const create = () => {
    const id = crypto.randomUUID();
    change((current) => [
      ...current,
      { id, title: t("New conversation", "নতুন কথোপকথন"), messages: [] },
    ]);
    go(id);
  };
  const open = () => {
    previous.current = path;
    const last = threads.at(-1);
    if (last) go(last.id);
    else create();
  };
  const close = useCallback(() => {
    void navigate({ to: previous.current });
  }, [navigate]);
  useEffect(() => {
    if (!routeId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [routeId, close]);
  return (
    <>
      {!routeId && (
        <Button
          onClick={open}
          className="no-print fixed bottom-5 right-5 z-50 h-14 gap-2 rounded-full px-4 shadow-glow"
          aria-label={t("Open AI Concierge", "এআই কনসিয়ার্জ খুলুন")}
        >
          <img src={avatar} width={40} height={40} alt="" loading="lazy" className="h-10 w-10" />
          <span>AI Concierge</span>
        </Button>
      )}
      {routeId && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="concierge-title"
          className="concierge-panel no-print fixed z-50 flex flex-col overflow-hidden rounded-lg border border-secondary/40 bg-background shadow-glow"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-4 py-3">
            <img src={avatar} alt="" loading="lazy" width={44} height={44} className="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <h2 id="concierge-title" className="text-sm font-bold">
                AI HUB BD <span className="text-secondary">Concierge</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("Your hub, a conversation away", "আপনার হাব, কথোপকথনেই কাছে")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              title={t("Conversations", "কথোপকথন")}
              aria-label={t("Conversations", "কথোপকথন")}
              aria-expanded={history}
              onClick={() => setHistory(!history)}
            >
              <History />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={t("Close concierge", "কনসিয়ার্জ বন্ধ করুন")}
              aria-label={t("Close concierge", "কনসিয়ার্জ বন্ধ করুন")}
              onClick={close}
            >
              <X />
            </Button>
          </header>
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2">
            <Button size="sm" variant="ghost" onClick={create}>
              <Plus />
              {t("New chat", "নতুন চ্যাট")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setLang(lang === "en" ? "bn" : "en")}>
              <Languages />
              {lang === "en" ? "বাংলা" : "English"}
            </Button>
          </div>
          {history && (
            <nav
              aria-label={t("Saved conversations", "সংরক্ষিত কথোপকথন")}
              className="nice-scroll max-h-48 shrink-0 overflow-auto border-b border-border bg-card p-2"
            >
              {[...threads].reverse().map((thread) => (
                <div key={thread.id} className="flex items-center gap-1">
                  <Button
                    variant={thread.id === routeId ? "secondary" : "ghost"}
                    className="min-w-0 flex-1 justify-start"
                    onClick={() => go(thread.id)}
                  >
                    <span className="truncate">{thread.title}</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title={t("Delete conversation", "কথোপকথন মুছুন")}
                    aria-label={`${t("Delete conversation", "কথোপকথন মুছুন")}: ${thread.title}`}
                    onClick={() => {
                      change((current) => current.filter((c) => c.id !== thread.id));
                      if (thread.id === routeId) {
                        const other = threads.find((c) => c.id !== thread.id);
                        if (other) go(other.id);
                        else close();
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </nav>
          )}
          {storageError && (
            <p role="alert" className="px-4 text-xs text-destructive">
              {t(
                "Browser storage is full; this chat cannot be saved.",
                "ব্রাউজারের স্টোরেজ পূর্ণ; চ্যাট সংরক্ষণ করা যাচ্ছে না।",
              )}
            </p>
          )}
          {active && <ChatWindow key={active.id} thread={active} save={save} />}
          <div className="flex shrink-0 gap-2 border-t border-border p-3">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <Link to="/order">
                <UtensilsCrossed />
                {t("Order food", "খাবার অর্ডার")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/book">
                <CalendarDays />
                {t("Book a seat", "সিট বুকিং")}
              </Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

function ChatWindow({
  thread,
  save,
}: {
  thread: ConciergeThread;
  save: (id: string, messages: UIMessage[]) => void;
}) {
  const { lang, t } = useLang();
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState<Workflow | null>(null);
  const [voiceReplies, setVoiceReplies] = useLocalStorage("aihub.concierge.voice", false);
  const voiceRef = useRef(voiceReplies);
  voiceRef.current = voiceReplies;
  const ref = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/public/concierge" }), []);
  const { messages, sendMessage, status, error, stop, regenerate, clearError } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
    onFinish: ({ messages: completed, isError, isDisconnect }) => {
      if (!isError && !isDisconnect) {
        save(thread.id, completed);
        const last = completed[completed.length - 1];
        if (voiceRef.current && last?.role === "assistant") {
          speak(last.parts.map((p) => (p.type === "text" ? p.text : "")).join(" "), lang);
        }
      }
    },
  });
  const busy = status === "submitted" || status === "streaming";
  const current = useRef(messages);
  current.current = messages;
  useEffect(() => {
    ref.current?.focus();
  }, [status]);
  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );
  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    clearError();
    setInput("");
    // Persist the visitor's turn immediately; assistant output is saved once on completion.
    const user: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: text.trim() }],
    };
    save(thread.id, [...current.current, user]);
    ref.current?.focus();
    await sendMessage(user, { body: { lang } });
  };
  const prompts = [
    ["What can I do for ৳100?", "৳১০০ সেশনে কী করতে পারি?"],
    ["Where is the hub?", "হাবের ঠিকানা ও সময় কী?"],
    ["Show me the café menu", "ক্যাফের মেনু দেখান"],
    ["Compare business packages", "ব্যবসায়িক প্যাকেজ তুলনা করুন"],
    ["Investment opportunities", "বিনিয়োগের সুযোগ কী?"],
  ];
  return (
    <>
      <Conversation
        className="min-h-0 flex-1"
        aria-label={t("Concierge messages", "কনসিয়ার্জ বার্তা")}
      >
        <ConversationContent className="gap-5 p-4">
          {messages.length === 0 && (
            <div className="py-3">
              <img
                src={avatar}
                width={64}
                height={64}
                alt="AI HUB BD robotic concierge"
                loading="lazy"
                className="mb-3 h-16 w-16"
              />
              <h3 className="text-xl font-bold">
                {t("Hello, welcome to AI HUB BD.", "স্বাগতম, AI HUB BD-তে।")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("What would you like to explore?", "আপনি কী জানতে চান?")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {prompts.map(([en, bn]) => (
                  <Button
                    key={en}
                    variant="outline"
                    size="sm"
                    className="h-auto whitespace-normal py-2 text-left"
                    onClick={() => void send(t(en ?? "", bn ?? ""))}
                  >
                    {t(en ?? "", bn ?? "")}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <Message key={m.id} from={m.role}>
              <MessageContent
                className={
                  m.role === "user"
                    ? "rounded-lg bg-secondary text-secondary-foreground"
                    : "max-w-full bg-transparent text-foreground"
                }
              >
                {m.parts.map((part, j) =>
                  part.type === "text" ? (
                    <MessageResponse key={j}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
              {m.role === "assistant" && !busy && (
                <MessageActions>
                  <MessageAction
                    tooltip={t("Copy answer", "উত্তর কপি করুন")}
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        m.parts
                          .filter((p) => p.type === "text")
                          .map((p) => p.text)
                          .join("\n"),
                      );
                    }}
                  >
                    <Copy />
                  </MessageAction>
                  {i === messages.length - 1 && (
                    <MessageAction
                      tooltip={t("Try again", "আবার চেষ্টা করুন")}
                      onClick={() => void regenerate({ body: { lang } })}
                    >
                      <RotateCcw />
                    </MessageAction>
                  )}
                </MessageActions>
              )}
            </Message>
          ))}
          {status === "submitted" && (
            <div role="status">
              <Shimmer>{t("Thinking…", "ভাবছি…")}</Shimmer>
            </div>
          )}
          {error && (
            <div role="alert" className="text-sm text-destructive">
              <p>{error.message}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => void regenerate({ body: { lang } })}
              >
                <RotateCcw />
                {t("Try again", "আবার চেষ্টা করুন")}
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="shrink-0 px-3 pb-3">
        {flow && (
          <div className="mb-2 max-h-[55vh] overflow-y-auto">
            <WorkflowPanel
              key={flow.id}
              workflow={flow}
              onCancel={() => setFlow(null)}
              onSubmit={(prompt) => {
                setFlow(null);
                void send(prompt);
              }}
            />
          </div>
        )}
        <PromptInput onSubmit={({ text }) => send(text)}>
          <PromptInputTextarea
            ref={ref}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={16000}
            aria-label={t("Message the AI Concierge", "এআই কনসিয়ার্জকে বার্তা লিখুন")}
            placeholder={t("Ask about the hub…", "হাব সম্পর্কে জিজ্ঞেস করুন…")}
            className="max-h-40 min-h-16 text-base"
          />
          <PromptInputFooter className="justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <ConciergeTools onPick={setFlow} />
              <VoiceInputButton disabled={busy} onText={(v) => setInput((cur) => (cur ? `${cur} ${v}` : v))} />
              <ReadAloudToggle on={voiceReplies} onChange={setVoiceReplies} />
            </div>
            <PromptInputSubmit
              status={status}
              onStop={() => void stop()}
              disabled={!busy && !input.trim()}
              aria-label={busy ? t("Stop reply", "উত্তর থামান") : t("Send message", "বার্তা পাঠান")}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          {t("AI can make mistakes.", "এআই ভুল করতে পারে।")}
        </p>
      </div>
    </>
  );
}
