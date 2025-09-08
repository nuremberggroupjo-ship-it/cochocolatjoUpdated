import { z } from "zod"

// Delivery info schema for authenticated users only
export const deliveryInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^07\d{8}$/,
      "Phone number must start with 07 and be exactly 10 digits",
    ),
  selectedAddressId: z.string().min(1, "Please select a delivery address"),
  additionalNotes: z.string().optional(),
  isGift: z.boolean().optional(),
  date: z.string().optional(),
})

export type DeliveryInfoFormData = z.infer<typeof deliveryInfoSchema>
