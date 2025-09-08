"use client"

import { useEffect } from "react"

import { useAction } from "next-safe-action/hooks"

import { revalidateCartAfterOrder } from "@/features/checkout/actions/cart-cleanup.actions"

/**
 * Component to clean up cart state after successful order
 * This runs on the success page to clear cart data without interfering with the order flow
 */
export function OrderSuccessCartCleanup() {
  const { execute } = useAction(revalidateCartAfterOrder)

  useEffect(() => {
    // Small delay to ensure navigation is complete
    const timeoutId = setTimeout(() => {
      execute()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [execute])

  // This component doesn't render anything visible
  return null
}
