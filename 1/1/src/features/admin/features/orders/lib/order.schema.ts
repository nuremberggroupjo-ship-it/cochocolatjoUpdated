import { z } from "zod"

import { OrderStatus } from "@/lib/_generated/prisma"

/**
 * Schema for editing order information
 * Only allows editing of status fields as requested by user
 * No adding or deleting orders, only editing existing ones
 */
export const saveOrderSchema = z.object({
  id: z.string().min(1, "Order ID is required"),

  // Order status management
  status: z.nativeEnum(OrderStatus, {
    required_error: "Order status is required",
    invalid_type_error: "Invalid order status",
  }),

  // Payment status management
  isPaid: z.boolean({
    required_error: "Payment status is required",
  }),
  paidAt: z.date().optional().nullable(),

  // Delivery status management
  isDelivered: z.boolean({
    required_error: "Delivery status is required",
  }),
  deliveredAt: z.date().optional().nullable(),
})

export type SaveOrderSchema = z.infer<typeof saveOrderSchema>
