import { createServerFn } from "@tanstack/react-start";
import { inquirySchema } from "./inquiry-schema";

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Public, insert-only intake: no caller-selected table, reads or recipients.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("inquiry_submissions")
      .insert({ ...data, phone: data.phone ?? null, company: data.company ?? null })
      .select("id, created_at")
      .single();
    if (error || !row) throw new Error("Your request could not be saved. Please try again.");
    return { id: row.id, createdAt: new Date(row.created_at).getTime() };
  });
