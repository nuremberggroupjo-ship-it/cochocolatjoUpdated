import { useEffect, useRef } from "react"

import { UseFormReturn } from "react-hook-form"

import type { OrderAdminData } from "@/types/db"

import { OrderStatus } from "@/lib/_generated/prisma"

import type { SaveOrderSchema } from "@/features/admin/features/orders/lib/order.schema"

interface UseOrderFormSyncProps {
  form: UseFormReturn<SaveOrderSchema>
  order: OrderAdminData
  status: OrderStatus
  isPaid: boolean
  isDelivered: boolean
}

export function useOrderFormSync({
  form,
  order,
  status,
  isPaid,
  isDelivered,
}: UseOrderFormSyncProps) {
  // Track if user manually changed delivery or payment status to prevent auto-override
  const userChangedDelivery = useRef(false)
  const userChangedPayment = useRef(false)
  const prevStatus = useRef(status)

  useEffect(() => {
    // Detect if status changed (not delivery checkbox)
    const statusChanged = prevStatus.current !== status
    if (statusChanged) {
      prevStatus.current = status
      userChangedDelivery.current = false // Reset when status changes
      userChangedPayment.current = false // Reset when status changes
    }

    // BIDIRECTIONAL STATUS-CHECKBOX SYNCHRONIZATION LOGIC:
    //
    // FORWARD PROGRESSION (Checkboxes → Status):
    // ✅ Both paid + delivered → DELIVERED
    // ✅ Delivered only (non-COD) → SHIPPED
    // ✅ Paid only → PROCESSING
    //
    // BACKWARD REGRESSION (Checkboxes → Status):
    // ✅ Both unchecked → PENDING
    //
    // STATUS → CHECKBOX SYNC:
    // ✅ Status changed to DELIVERED → Auto-check delivery (one-time)

    // FIXED: Only auto-sync delivery when status changes TO delivered
    // AND user hasn't manually unchecked it recently
    if (
      statusChanged &&
      status === OrderStatus.DELIVERED &&
      !isDelivered &&
      !userChangedDelivery.current
    ) {
      form.setValue("isDelivered", true, { shouldDirty: true })
    }

    // Auto-update status based on delivery and payment state
    // Only update if current status allows progression or regression
    if (isDelivered && isPaid && status !== OrderStatus.DELIVERED) {
      // If both delivered and paid, suggest DELIVERED status
      if (
        status === OrderStatus.PENDING ||
        status === OrderStatus.PROCESSING ||
        status === OrderStatus.SHIPPED
      ) {
        form.setValue("status", OrderStatus.DELIVERED, { shouldDirty: true })
      }
    } else if (isDelivered && !isPaid && status !== OrderStatus.SHIPPED) {
      // If delivered but not paid (except COD), suggest SHIPPED status
      if (
        order.paymentMethod !== "CASH_ON_DELIVERY" &&
        (status === OrderStatus.PENDING || status === OrderStatus.PROCESSING)
      ) {
        form.setValue("status", OrderStatus.SHIPPED, { shouldDirty: true })
      }
    } else if (isPaid && !isDelivered && status === OrderStatus.PENDING) {
      // If paid but not delivered, suggest PROCESSING status
      form.setValue("status", OrderStatus.PROCESSING, { shouldDirty: true })
    } else if (!isPaid && !isDelivered && status !== OrderStatus.PENDING) {
      // NEW: If both unchecked, revert to PENDING status
      // Only revert from higher statuses (not from terminal states like CANCELLED/REFUNDED)
      if (
        status === OrderStatus.PROCESSING ||
        status === OrderStatus.SHIPPED ||
        status === OrderStatus.DELIVERED
      ) {
        form.setValue("status", OrderStatus.PENDING, { shouldDirty: true })
      }
    }

    // Warn if trying to mark as delivered without payment (except COD)
    if (isDelivered && !isPaid && order.paymentMethod !== "CASH_ON_DELIVERY") {
      console.warn("Delivery marked without payment confirmation")
    }
  }, [status, isPaid, isDelivered, form, order.paymentMethod])

  // Create custom handlers for checkboxes that track user intent
  const handleDeliveryChange = (checked: boolean) => {
    userChangedDelivery.current = true
    form.setValue("isDelivered", checked, { shouldDirty: true })
  }

  const handlePaymentChange = (checked: boolean) => {
    userChangedPayment.current = true
    form.setValue("isPaid", checked, { shouldDirty: true })
  }

  // Generate real-time warnings for display
  const getRealTimeWarnings = (): string[] => {
    const warnings = []

    if (isDelivered && !isPaid && order.paymentMethod !== "CASH_ON_DELIVERY") {
      warnings.push("Order marked as delivered without payment confirmation")
    }

    if (order.isDelivered && !isDelivered) {
      warnings.push("Changing delivered status from confirmed to unconfirmed")
    }

    if (order.isPaid && !isPaid) {
      warnings.push("Changing payment status from received to not received")
    }

    return warnings
  }

  return {
    realTimeWarnings: getRealTimeWarnings(),
    handleDeliveryChange,
    handlePaymentChange,
  }
}
