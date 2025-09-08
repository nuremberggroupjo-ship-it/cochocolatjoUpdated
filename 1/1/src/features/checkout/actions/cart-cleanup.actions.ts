"use server"

import { revalidateTag } from "next/cache"

import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import { actionClient } from "@/lib/safe-action"

/**
 * Revalidate cart data after successful order creation
 * This should be called from the success page to clear cart state
 */
export const revalidateCartAfterOrder = actionClient
  .metadata({
    actionName: "revalidateCartAfterOrder",
  })
  .action(async () => {
    const { sessionCartId, userId } = await getCurrentSessionInfo()

    if (sessionCartId) {
      revalidateTag(`cart-session-${sessionCartId}`)
    }

    if (userId) {
      revalidateTag(`cart-user-${userId}`)
    }

    return {
      success: true,
      message: "Cart data refreshed",
    }
  })
