"use server"

import { revalidatePath } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"

import { getCurrentUserInfo } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { paymentMethodSchema } from "@/features/checkout/schemas/payment-method.schema"

/**
 * Save payment method selection
 */
export const savePaymentMethod = actionClient
  .metadata({
    actionName: "savePaymentMethod",
  })
  .inputSchema(paymentMethodSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const user = await getCurrentUserInfo()

    if (!user) {
      throw new Error("User not authenticated")
    }
    // Validate that the payment method is in the allowed list
    const allowedMethods = ["CASH_ON_DELIVERY", "CLIQ"] as const
    if (
      !allowedMethods.includes(
        parsedInput.paymentMethod as (typeof allowedMethods)[number],
      )
    ) {
      throw new Error("Invalid payment method selected")
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        paymentMethod: parsedInput.paymentMethod,
      },
    })

    revalidatePath("/checkout/delivery/payment-method")

    return {
      success: true,
      data: parsedInput,
      message: "Payment method selected successfully",
    }
  })
