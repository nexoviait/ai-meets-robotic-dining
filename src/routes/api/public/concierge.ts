import { createFileRoute } from "@tanstack/react-router";
import { conciergeInstructions, conciergeRequest } from "@/lib/concierge";

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
