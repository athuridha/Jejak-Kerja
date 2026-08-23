import { z } from "zod";

// Shared validation schemas. cvUrl/portfolioUrl must be real URLs when present.
const urlOrEmpty = z
  .string()
  .trim()
  .url("Must be a valid URL (include https://)")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const applicationSchema = z.object({
  position: z.string().trim().min(1, "Position is required"),
  companyName: z.string().trim().min(1, "Company is required"),
  statusId: z.string().trim().min(1, "Status is required"),
  recruiter: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("").transform(() => undefined)),
  appliedAt: z.coerce.date().optional(),
  notes: z.string().trim().optional(),
  cvUrl: urlOrEmpty,
  portfolioUrl: urlOrEmpty,
});

export const statusSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Color must be a hex code like #3b82f6"),
  order: z.coerce.number().int().min(0).default(0),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type StatusInput = z.infer<typeof statusSchema>;
