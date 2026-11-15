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
