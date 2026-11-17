import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

const refreshRequest = z.object({ action: z.literal("refresh") }).strict();

export const Route = createFileRoute("/api/public/district-hub-refresh")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;

        const parsed = refreshRequest.safeParse(await request.json().catch(() => null));
        if (!parsed.success)
          return Response.json(
            { success: false, error: "Invalid refresh request" },
            { status: 400 },
          );

        try {
          const { refreshDistrictHubBatch } = await import("@/lib/district-hub-refresh.server");
          const result = await refreshDistrictHubBatch(Math.floor(Date.now() / 86_400_000));
          return Response.json({ success: true, ...result });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "District coordinate refresh failed";
          console.error("Scheduled district coordinate refresh failed", message);
          return Response.json({ success: false, error: message }, { status: 502 });
        }
      },
    },
  },
});
