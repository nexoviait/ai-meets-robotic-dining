import { z } from "zod";

export const inquirySchema = z.object({
  source: z.enum(["contact", "investor", "business"]),
  kind: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Please add a short message").max(1000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
