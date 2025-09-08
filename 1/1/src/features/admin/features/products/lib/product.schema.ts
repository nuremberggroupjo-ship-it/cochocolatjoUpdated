import * as z from "zod"

export const saveProductSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),

    // Make size optional
    size: z
      .string()
      .max(100, "Size cannot exceed 100 characters")
      .optional(),

    // Make unit optional
    unit: z
      .string()
      .max(100, "Unit cannot exceed 100 characters")
      .optional(),

    slug: z
      .string()
      .min(1, "Slug is required")
      .max(100, "Slug cannot exceed 100 characters"),
    price: z.coerce
      .number()
      .min(0.01, "Price is required and must be greater than 0"),
    discountPrice: z.coerce.number().positive().nullable().optional(),
    isDiscountActive: z.boolean(),
    stock: z.coerce
      .number()
      .int()
      .nonnegative("Stock must be a positive number"),
    isFeatured: z.boolean(),
    categoryId: z
      .string()
      .min(1, "Category is required")
      .uuid("Invalid category ID"),
    attributes: z.array(z.string().uuid()).optional(),
    ingredients: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    images: z
      .array(
        z.object({
          id: z.string().uuid(),
          url: z.string().min(1, "Image URL is required"),
        }),
      )
      .min(1, "At least one image is required")
      .max(4, "Maximum of 4 images allowed"),
    isActive: z.boolean(),
  })
  .transform((data) => {
    // 🔥 Auto-clear discount price when discount is inactive
    if (!data.isDiscountActive) {
      data.discountPrice = null
    }
    return data
  })
  .refine(
    (data) => {
      // If discount is active, must have discount price
      if (data.isDiscountActive && !data.discountPrice) {
        return false
      }
      return true
    },
    {
      message: "Discount price is required when discount is active",
      path: ["discountPrice"],
    },
  )
  .refine(
    (data) => {
      // Discount price must be less than regular price
      if (data.discountPrice && data.discountPrice >= data.price) {
        return false
      }
      return true
    },
    {
      message: "Discount price must be less than regular price",
      path: ["discountPrice"],
    },
  )

export type SaveProductSchema = z.infer<typeof saveProductSchema>
