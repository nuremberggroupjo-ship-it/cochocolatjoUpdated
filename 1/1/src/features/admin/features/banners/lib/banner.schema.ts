import * as z from "zod"

export const saveBannerSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters"),
  image: z.string().min(1, "Image is required"),
  priority: z
    .number()
    .int()
    .min(0, "Priority must be a non-negative integer")
    .optional(),
  isActive: z.boolean(),
})

export type SaveBannerSchema = z.infer<typeof saveBannerSchema>
