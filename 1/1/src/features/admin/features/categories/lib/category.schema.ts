import * as z from "zod"

export const saveCategorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters"),
  thumbnailImage: z.string().min(1, "Thumbnail image is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
})

export type SaveCategorySchema = z.infer<typeof saveCategorySchema>
