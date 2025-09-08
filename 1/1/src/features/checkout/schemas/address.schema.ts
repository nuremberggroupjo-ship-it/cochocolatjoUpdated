import { z } from "zod"

import { JORDAN_CITIES } from "@/features/checkout/constants"

// Base address schema for forms
export const addressFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.enum(JORDAN_CITIES, {
    required_error: "Please select a city",
  }),
  street: z.string().min(1, "Street is required"),
  area: z.string().min(1, "Area is required"),
  buildingNumber: z
    .string()
    .min(1, "Building number is required")
    .regex(
      /^[a-zA-Z0-9\s\-\/]+$/,
      "Building number contains invalid characters",
    ),
  apartmentNumber: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s\-\/]*$/,
      "Apartment number contains invalid characters",
    )
    .optional(),
  isDefault: z.boolean().optional(),
})

// Extended address schema with ID and timestamps
export const addressSchema = addressFormSchema.extend({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const deleteAddressSchema = z.object({
  addressId: z.string().min(1, "Address ID is required"),
})

export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>
export type AddressFormData = z.infer<typeof addressFormSchema>
export type AddressSchema = z.infer<typeof addressSchema>
