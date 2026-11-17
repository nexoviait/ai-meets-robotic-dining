import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Briefcase,
  Copy,
  Film,
  Image as ImageIcon,
  Music,
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
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ConciergeTools, ReadAloudToggle, VoiceInputButton, speak } from "../ConciergeTools";
import { WorkflowPanel } from "../WorkflowPanel";
import { useLang } from "@/lib/i18n";
import { useLocalStorage } from "@/lib/storage";
import { ASSISTANT } from "@/lib/data";
import { trimHistoryForRequest, type ConciergeThread } from "@/lib/concierge-history";
import { WORKFLOWS, type Workflow } from "@/lib/concierge-workflows";
import { FLOW_EVENT, takePendingWorkflow } from "@/lib/concierge-open";
import avatar from "@/assets/concierge.png";

const FLOW_ICONS = { business: Briefcase, image: ImageIcon, video: Film, audio: Music };

const PROMPTS = [
  ["What can I do for ৳100?", "৳১০০ সেশনে কী করতে পারি?"],
  ["Where is the hub and when is it open?", "হাবের ঠিকানা ও সময় কী?"],
  ["Show me the café menu", "ক্যাফের মেনু দেখান"],
  ["Compare business packages", "ব্যবসায়িক প্যাকেজ তুলনা করুন"],
] as const;

function greeting(lang: "en" | "bn") {
  const h = new Date().getHours();
  if (lang === "bn") return h < 12 ? "শুভ সকাল" : h < 17 ? "শুভ অপরাহ্ন" : "শুভ সন্ধ্যা";
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const textOf = (m: UIMessage) =>
  m.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("\n");

/** One conversation: the message column and composer of the full-page chat. */
export function ChatThread({
  thread,
  save,
}: {
  thread: ConciergeThread;
  save: (id: string, messages: UIMessage[]) => void;
}) {
  const { lang, t } = useLang();
  const name = lang === "bn" ? ASSISTANT.nameBn : ASSISTANT.name;
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState<Workflow | null>(() => {
    const id = takePendingWorkflow();
    return WORKFLOWS.find((w) => w.id === id) ?? null;
  });
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      takePendingWorkflow();
      setFlow(WORKFLOWS.find((w) => w.id === id) ?? null);
    };
    window.addEventListener(FLOW_EVENT, h);
    return () => window.removeEventListener(FLOW_EVENT, h);
  }, []);
  const [voiceReplies, setVoiceReplies] = useLocalStorage("aihub.concierge.voice", false);
  const voiceRef = useRef(voiceReplies);
  voiceRef.current = voiceReplies;
  const ref = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/public/concierge",
        // Long threads stay in local history, but only recent turns are sent so requests
        // remain within the route's size limits.
        prepareSendMessagesRequest: ({ id, messages, body }) => ({
          body: { ...body, id, messages: trimHistoryForRequest(messages) },
        }),
      }),
    [],
  );
  const { messages, sendMessage, status, error, stop, regenerate, clearError } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
    onFinish: ({ messages: completed, isError, isDisconnect }) => {
      if (!isError && !isDisconnect) {
        save(thread.id, completed);
        const last = completed[completed.length - 1];
        if (voiceRef.current && last?.role === "assistant") speak(textOf(last), lang);
      }
    },
  });
  const busy = status === "submitted" || status === "streaming";
  const empty = messages.length === 0;
  const current = useRef(messages);
  current.current = messages;
  useEffect(() => {
    ref.current?.focus();
  }, [status, empty]);
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
    await sendMessage(user, { body: { lang } });
  };

  const copy = async (m: UIMessage) => {
    try {
      await navigator.clipboard.writeText(textOf(m));
      toast.success(t("Copied", "কপি হয়েছে"));
    } catch {
      toast.error(t("Couldn't copy", "কপি করা যায়নি"));
    }
  };

  const composer = (
    <div className="w-full">
      {flow && (
        <div className="mb-3 max-h-[50vh] overflow-y-auto">
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
      <PromptInput
        onSubmit={({ text }) => send(text)}
        className="[&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-card [&_[data-slot=input-group]]:shadow-lg [&_[data-slot=input-group]]:focus-within:border-secondary/60"
      >
        <PromptInputTextarea
          ref={ref}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={16000}
          aria-label={t(`Message ${name}`, `${name}-কে বার্তা লিখুন`)}
          placeholder={t(`Message ${name}…`, `${name}-কে জিজ্ঞেস করুন…`)}
          className="max-h-52 min-h-14 px-4 pt-4 text-base"
        />
        <PromptInputFooter className="gap-2 px-3 pb-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <ConciergeTools onPick={setFlow} />
            <VoiceInputButton
              disabled={busy}
              onText={(v) => setInput((cur) => (cur ? `${cur} ${v}` : v))}
            />
            <ReadAloudToggle on={voiceReplies} onChange={setVoiceReplies} />
          </div>
          <PromptInputSubmit
            status={status}
            onStop={() => void stop()}
            disabled={!busy && !input.trim()}
            className="rounded-full"
            aria-label={busy ? t("Stop reply", "উত্তর থামান") : t("Send message", "বার্তা পাঠান")}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );

  if (empty) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <img src={avatar} alt="" width={56} height={56} className="h-14 w-14" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{greeting(lang)}</h2>
            <p className="mt-2 text-muted-foreground">
              {t(
                `I'm ${name}. How can I help you today?`,
                `আমি ${name}। আজ কীভাবে সাহায্য করতে পারি?`,
              )}
            </p>
          </div>
          {composer}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {PROMPTS.map(([en, bn]) => (
              <Button
                key={en}
                variant="outline"
                size="sm"
                className="h-auto rounded-full py-1.5 whitespace-normal"
                onClick={() => void send(t(en, bn))}
              >
                {t(en, bn)}
              </Button>
            ))}
          </div>
          <h3 className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("Guided workflows", "ধাপে ধাপে ওয়ার্কফ্লো")}
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {WORKFLOWS.map((w) => {
              const Icon = FLOW_ICONS[w.id];
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setFlow(w)}
                  aria-pressed={flow?.id === w.id}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card/50 p-3 text-left transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-secondary/60"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{w.title[lang]}</span>
                    <span className="block text-xs text-muted-foreground">{w.hint[lang]}</span>
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1" aria-label={t("Messages", "বার্তাসমূহ")}>
        <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-4 py-8">
          {messages.map((m, i) => (
            <Message key={m.id} from={m.role} className="max-w-full">
              {m.role === "user" ? (
                <MessageContent className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-base text-foreground group-[.is-user]:rounded-2xl group-[.is-user]:bg-muted group-[.is-user]:py-2.5">
                  <p className="whitespace-pre-wrap break-words">{textOf(m)}</p>
                </MessageContent>
              ) : (
                <div className="flex gap-3">
                  <img
                    src={avatar}
                    alt=""
                    width={28}
                    height={28}
                    className="mt-0.5 h-7 w-7 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <MessageContent className="max-w-full text-base leading-7">
                      {m.parts.map((part, j) =>
                        part.type === "text" ? (
                          <MessageResponse key={j}>{part.text}</MessageResponse>
                        ) : null,
                      )}
                    </MessageContent>
                    {!(busy && i === messages.length - 1) && (
                      <MessageActions className="mt-2 -ml-2">
                        <MessageAction tooltip={t("Copy", "কপি করুন")} onClick={() => void copy(m)}>
                          <Copy />
                        </MessageAction>
                        {i === messages.length - 1 && !busy && (
                          <MessageAction
                            tooltip={t("Retry", "আবার চেষ্টা করুন")}
                            onClick={() => void regenerate({ body: { lang } })}
                          >
                            <RotateCcw />
                          </MessageAction>
                        )}
                      </MessageActions>
                    )}
                  </div>
                </div>
              )}
            </Message>
          ))}
          {status === "submitted" && (
            <div role="status" className="flex items-center gap-3">
              <img src={avatar} alt="" width={28} height={28} className="h-7 w-7" />
              <Shimmer>{t("Thinking…", "ভাবছি…")}</Shimmer>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
            >
              <p>{error.message}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
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
      <div className="shrink-0 px-4 pb-3 pt-1">
        <div className="mx-auto w-full max-w-3xl">
          {composer}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t(
              `${name} can make mistakes. Please check important information.`,
              `${name} ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নিন।`,
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
