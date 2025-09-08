import { z } from "zod"

export const pickupInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^07\d{8}$/,
      "Phone number must start with 07 and be exactly 10 digits",
    ),
  additionalNotes: z.string().optional(),
  isGift: z.boolean().optional(),
    date: z.string().optional(),
})

export type PickupInfoSchema = z.infer<typeof pickupInfoSchema>
