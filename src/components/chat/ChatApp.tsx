import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { toast } from "sonner";
import { Lock, Menu, Search, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";
import { ASSISTANT } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  HISTORY_KEY,
  readThreads,
  recentThreads,
  saveThread,
  type ConciergeThread,
} from "@/lib/concierge-history";
import { ChatThread } from "./ChatThread";
import avatar from "@/assets/concierge.png";

function readSavedThreads() {
  try {
    return readThreads(localStorage.getItem(HISTORY_KEY));
  } catch {
    return [];
  }
}

function writeSavedThreads(threads: ConciergeThread[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(threads));
    return true;
  } catch {
    return false;
  }
}

/**
 * The full-page assistant at /chat and /chat/$threadId. A new chat is an unsaved draft until its
 * first message; it then gets its /chat/$threadId address without remounting the conversation.
 */
export function ChatApp() {
  const { t, lang } = useLang();
  const name = lang === "bn" ? ASSISTANT.nameBn : ASSISTANT.name;
  const navigate = useNavigate();
  const { threadId: routeId } = useParams({ strict: false }) as { threadId?: string };
  const routeRef = useRef(routeId);
  routeRef.current = routeId;
  const [threads, setThreads] = useState<ConciergeThread[]>(readSavedThreads);
  const threadsRef = useRef(threads);
  threadsRef.current = threads;
  const [draftId, setDraftId] = useState(() => crypto.randomUUID());
  const [storageError, setStorageError] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [query, setQuery] = useState("");

  const activeId = routeId ?? draftId;
  const active = threads.find((thread) => thread.id === activeId) ?? {
    id: activeId,
    title: "",
    messages: [],
  };

  const commit = useCallback((next: ConciergeThread[]) => {
    threadsRef.current = next;
    setThreads(next);
    setStorageError(!writeSavedThreads(next));
  }, []);

  // Keep the list in sync when chats change in another tab.
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) setThreads(readSavedThreads());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const save = useCallback(
    (id: string, messages: UIMessage[]) => {
      commit(saveThread(threadsRef.current, id, messages));
      // First message of a new chat: give it a shareable address in place.
      if (!routeRef.current)
        void navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
    },
    [commit, navigate],
  );

  const startNew = () => {
    setDrawer(false);
    setDraftId(crypto.randomUUID());
    if (routeId) void navigate({ to: "/chat" });
  };

  const remove = (thread: ConciergeThread) => {
    const before = threadsRef.current;
    commit(before.filter((item) => item.id !== thread.id));
    if (thread.id === activeId) startNew();
    toast(t("Chat deleted", "চ্যাট মুছে ফেলা হয়েছে"), {
      action: { label: t("Undo", "ফিরিয়ে আনুন"), onClick: () => commit(before) },
    });
  };

  const title = active.title || t("New chat", "নতুন চ্যাট");
  useEffect(() => {
    document.title = active.title ? `${active.title} — ${name}` : `${name} — AI HUB BD`;
  }, [active.title, name]);

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return recentThreads(threads).filter((thread) => thread.title.toLocaleLowerCase().includes(q));
  }, [threads, query]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 pt-4">
        <img src={avatar} alt="" width={28} height={28} className="h-7 w-7" />
        <span className="font-bold">{name}</span>
      </div>
      <div className="grid gap-2 px-3 pt-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={startNew}>
          <SquarePen />
          {t("New chat", "নতুন চ্যাট")}
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("Search chats", "চ্যাট খুঁজুন")}
            placeholder={t("Search chats", "চ্যাট খুঁজুন")}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      <nav
        aria-label={t("Chat history", "চ্যাটের ইতিহাস")}
        className="nice-scroll mt-4 min-h-0 flex-1 overflow-y-auto px-2 pb-3"
      >
        <h2 className="px-2 pb-1.5 text-xs font-semibold text-muted-foreground">
          {t("Recents", "সাম্প্রতিক")}
        </h2>
        {list.length === 0 ? (
          <p className="px-2 py-1 text-sm text-muted-foreground">
            {query
              ? t("No chats match your search.", "এমন কোনো চ্যাট নেই।")
              : t("Your chats will appear here.", "আপনার চ্যাটগুলো এখানে দেখা যাবে।")}
          </p>
        ) : (
          <ul className="grid gap-0.5">
            {list.map((thread) => {
              const current = thread.id === activeId;
              const label = thread.title || t("New chat", "নতুন চ্যাট");
              return (
                <li key={thread.id} className="group/item relative min-w-0">
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: thread.id }}
                    onClick={() => setDrawer(false)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "block truncate rounded-lg py-2 pl-3 pr-10 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      current && "bg-accent font-medium text-foreground",
                    )}
                  >
                    {label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(thread)}
                    aria-label={`${t("Delete chat", "চ্যাট মুছুন")}: ${label}`}
                    title={t("Delete chat", "চ্যাট মুছুন")}
                    className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/item:opacity-100 [@media(hover:none)]:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <p className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        {t("Chats are saved only in this browser.", "চ্যাট শুধু এই ব্রাউজারেই সংরক্ষিত থাকে।")}
      </p>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        aria-label={t("Chats", "চ্যাট")}
        className="hidden w-64 shrink-0 border-r border-border bg-card/40 md:block"
      >
        {sidebar}
      </aside>
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">{t("Chats", "চ্যাট")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("Start a new chat or reopen a saved one.", "নতুন চ্যাট শুরু করুন বা পুরোনো চ্যাট খুলুন।")}
          </SheetDescription>
          {sidebar}
        </SheetContent>
      </Sheet>
      <section aria-labelledby="chat-title" className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-2 md:px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("Open chat list", "চ্যাট তালিকা খুলুন")}
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <Menu />
          </Button>
          <h1 id="chat-title" className="min-w-0 flex-1 truncate text-sm font-semibold">
            {title}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("New chat", "নতুন চ্যাট")}
            onClick={startNew}
          >
            <SquarePen />
          </Button>
        </div>
        {storageError && (
          <p
            role="alert"
            className="bg-destructive/10 px-4 py-2 text-center text-xs text-destructive"
          >
            {t(
              "Browser storage is full or blocked, so this chat can't be saved.",
              "ব্রাউজারের স্টোরেজ পূর্ণ বা বন্ধ; এই চ্যাট সংরক্ষণ করা যাচ্ছে না।",
            )}
          </p>
        )}
        <ChatThread key={activeId} thread={active} save={save} />
      </section>
    </div>
  );
}

/** Server render and first paint, before browser-saved chats can be read. */
export function ChatSkeleton() {
  return (
    <div className="flex min-h-0 flex-1" aria-busy="true">
      <div className="hidden w-64 shrink-0 border-r border-border bg-card/40 md:block" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <div className="h-14 w-14 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-28 w-full max-w-2xl animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
