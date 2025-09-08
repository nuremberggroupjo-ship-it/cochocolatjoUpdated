import * as z from "zod"

export const saveAttributeSchema = z.object({
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
  description: z.string().optional(),
})

export type SaveAttributeSchema = z.infer<typeof saveAttributeSchema>
