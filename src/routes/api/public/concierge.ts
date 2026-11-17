import { createFileRoute } from "@tanstack/react-router";
import { conciergeInstructions, conciergeRequest } from "@/lib/concierge";

/** The published app, whose concierge route holds the Lovable AI key. */
const PUBLISHED_ORIGIN = "https://ai-meets-robotic-dining.lovable.app";

/** Development only: streams the reply from the published concierge back to the local page. */
async function relayToPublishedConcierge(body: string, signal: AbortSignal) {
  try {
    const upstream = await fetch(`${PUBLISHED_ORIGIN}/api/public/concierge`, {
      method: "POST",
      // The published route only accepts same-origin requests, so speak as its own origin.
      headers: { "Content-Type": "application/json", Origin: PUBLISHED_ORIGIN },
      body,
      signal,
    });
    const headers = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "x-vercel-ai-ui-message-stream"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    console.error("Concierge relay to the published site failed", error);
    return new Response("The concierge is unavailable in local development right now.", {
      status: 502,
    });
  }
}

export const Route = createFileRoute("/api/public/concierge")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (!origin || origin !== new URL(request.url).origin)
          return new Response("Forbidden", { status: 403 });
        const raw = await request.text();
        if (raw.length > 250000) return new Response("Conversation is too large", { status: 413 });
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return new Response("Invalid request", { status: 400 });
        }
        const result = conciergeRequest.safeParse(parsed);
        if (!result.success) return new Response("Invalid conversation", { status: 400 });
        // LOVABLE_API_KEY exists only on Lovable's hosting and sandbox. A local dev server has no
        // key, so relay the already-validated conversation to the published concierge instead.
        if (import.meta.env.DEV && !process.env["LOVABLE_API_KEY"])
          return relayToPublishedConcierge(raw, request.signal);
        const { streamResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
        const { createUIMessageStream, createUIMessageStreamResponse } = await import("ai");
        const { messages, lang } = result.data;
        const stream = createUIMessageStream({
          execute: async ({ writer }) => {
            writer.write({ type: "start", messageId: crypto.randomUUID() });
            writer.write({ type: "text-start", id: "answer" });
            try {
              const response = await streamResponse(
                {
                  model: "openai/gpt-6-astra",
                  instructions: conciergeInstructions(lang),
                  input: messages.map((m) => ({
                    role: m.role,
                    content: m.parts.map((p) => p.text).join("\n"),
                  })),
                  reasoning: { effort: "low" },
                },
                { signal: request.signal },
              );
              let completed = false;
              for await (const event of response) {
                if (
                  event.type === "response.output_text.delta" ||
                  event.type === "response.refusal.delta"
                ) {
                  writer.write({ type: "text-delta", id: "answer", delta: event.delta });
                }
                if (event.type === "response.completed") completed = true;
                if (event.type === "response.incomplete") throw new Error("Incomplete answer");
              }
              if (!completed) throw new Error("Stream did not complete");
              writer.write({ type: "text-end", id: "answer" });
              writer.write({ type: "finish" });
            } catch (error) {
              if (error instanceof GatewayError)
                console.error("Concierge", {
                  code: error.code,
                  ids: error.ids,
                  outcome: error.outcome,
                });
              throw new Error(
                lang === "bn"
                  ? "কনসিয়ার্জ এখন উত্তর দিতে পারছে না। আপনার বার্তা রাখা হয়েছে। পরে আবার চেষ্টা করুন।"
                  : "The concierge couldn't finish this reply. Your message is kept; please try again later.",
              );
            }
          },
          onError: (error) => (error instanceof Error ? error.message : "Concierge unavailable"),
        });
        return createUIMessageStreamResponse({ stream, headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
