import { z } from "zod"

// Payment method enum to match database
export const paymentMethodEnum = z.enum(["VISA", "CASH_ON_DELIVERY", "CLIQ"])

// Available payment methods (excluding disabled ones)
export const availablePaymentMethodEnum = z.enum(["CASH_ON_DELIVERY", "CLIQ"])

// Payment method selection schema
export const paymentMethodSchema = z.object({
  paymentMethod: availablePaymentMethodEnum,
})

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>
export type PaymentMethodType = z.infer<typeof paymentMethodEnum>
export type AvailablePaymentMethodType = z.infer<
  typeof availablePaymentMethodEnum
>
