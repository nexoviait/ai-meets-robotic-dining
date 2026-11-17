import type { UIMessage } from "ai";
import { z } from "zod";

export interface ConciergeThread {
  id: string;
  title: string;
  messages: UIMessage[];
}
const historySchema = z.array(
  z.object({
    id: z.string().min(1),
    title: z.string(),
    messages: z.array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.object({ type: z.literal("text"), text: z.string() })),
      }),
    ),
  }),
);
export const HISTORY_KEY = "aihub.concierge.threads";
export function readThreads(raw: string | null): ConciergeThread[] {
  try {
    const result = historySchema.safeParse(JSON.parse(raw ?? "[]"));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
/** Messages sent per request; older turns stay in local history but are not re-sent. */
export const MAX_REQUEST_MESSAGES = 24;
/** Mirrors the server's per-part limit in conciergeRequest. */
export const MAX_PART_CHARS = 16000;

/**
 * Keeps long threads within the concierge route's request limits: the most recent turns only,
 * starting with a visitor message, with oversized text parts truncated.
 */
export function trimHistoryForRequest<M extends UIMessage>(messages: M[]): M[] {
  const recent = messages.slice(-MAX_REQUEST_MESSAGES);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return (firstUser > 0 ? recent.slice(firstUser) : recent).map((m) => ({
    ...m,
    parts: m.parts.map((p) =>
      p.type === "text" && p.text.length > MAX_PART_CHARS
        ? { ...p, text: p.text.slice(0, MAX_PART_CHARS) }
        : p,
    ),
  }));
}

/**
 * Saves a conversation's messages, creating the thread on its first message (so empty "new chat"
 * drafts never reach storage) and moving it last, so threads stay ordered by recent activity.
 */
export function saveThread(
  threads: ConciergeThread[],
  id: string,
  messages: UIMessage[],
): ConciergeThread[] {
  const existing = threads.find((thread) => thread.id === id) ?? { id, title: "", messages: [] };
  const [updated] = updateThread([existing], id, messages);
  return [...threads.filter((thread) => thread.id !== id), updated ?? existing];
}

/** Saved conversations, most recent first, skipping empty drafts left by older versions. */
export const recentThreads = (threads: ConciergeThread[]) =>
  threads.filter((thread) => thread.messages.length > 0).reverse();

export function updateThread(
  threads: ConciergeThread[],
  id: string,
  messages: UIMessage[],
): ConciergeThread[] {
  const first = messages.find((m) => m.role === "user")?.parts.find((p) => p.type === "text");
  return threads.map((thread) =>
    thread.id === id
      ? {
          ...thread,
          messages,
          title: first?.type === "text" ? first.text.slice(0, 60) : thread.title,
        }
      : thread,
  );
}
