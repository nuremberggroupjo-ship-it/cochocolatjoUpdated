import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import type { OrderAdminData } from "@/types/db"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { saveOrderAction } from "@/features/admin/features/orders/actions/save-order.action"
import type { SaveOrderSchema } from "@/features/admin/features/orders/lib/order.schema"

interface UseOrderSaveProps {
  order: OrderAdminData
}

export type OrderSaveReturn = {
  showWarningDialog: boolean
  currentWarnings: string[]
  isPending: boolean
  handleSubmit: (values: SaveOrderSchema) => void
  handleConfirmSubmit: () => void
  handleCancelSubmit: () => void
  setShowWarningDialog: Dispatch<SetStateAction<boolean>>
}

export function useOrderSave({ order }: UseOrderSaveProps): OrderSaveReturn {
  const router = useRouter()
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState<SaveOrderSchema | null>(
    null,
  )
  const [currentWarnings, setCurrentWarnings] = useState<string[]>([])

  // Setup server action - bind with order ID for the action that requires existingId
  const boundSaveOrderAction = saveOrderAction.bind(null, order.id)

  const { execute, isPending } = useAction(boundSaveOrderAction, {
    onSuccess: (args) => {
      toast.success(args.data?.message)
      // Navigate back to orders table after successful update
      router.push(ADMIN_TABLE.orders.routes.default)
    },
    onError: (args) => {
      toast.error(args.error.serverError)
    },
  })

  // Validate business logic and generate warnings
  const validateBusinessLogic = (values: SaveOrderSchema): string[] => {
    const warnings: string[] = []

    // Check if trying to mark as delivered without payment (for COD, this might be ok)
    if (
      values.isDelivered &&
      !values.isPaid &&
      order.paymentMethod !== "CASH_ON_DELIVERY"
    ) {
      warnings.push("Marking as delivered without payment confirmation")
    }

    // Check if changing from delivered to not delivered
    if (order.isDelivered && !values.isDelivered) {
      warnings.push("Changing delivery status from true to false")
    }

    // Check if changing from paid to not paid
    if (order.isPaid && !values.isPaid) {
      warnings.push("Changing payment status from received to not received")
    }

    return warnings
  }

  const handleSubmit = (values: SaveOrderSchema) => {
    const warnings = validateBusinessLogic(values)

    // Show dialog for warnings or proceed directly
    if (warnings.length > 0) {
      setCurrentWarnings(warnings)
      setPendingValues(values)
      setShowWarningDialog(true)
    } else {
      execute(values)
    }
  }

  // Handle confirmation from dialog
  const handleConfirmSubmit = () => {
    if (pendingValues) {
      execute(pendingValues)
    }
    closeWarningDialog()
  }

  // Handle cancellation from dialog
  const handleCancelSubmit = () => {
    closeWarningDialog()
  }

  // Close dialog and reset state
  const closeWarningDialog = () => {
    setShowWarningDialog(false)
    setPendingValues(null)
    setCurrentWarnings([])
  }

  return {
    // State
    showWarningDialog,
    currentWarnings,
    isPending,

    // Actions
    handleSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,

    // Dialog control
    setShowWarningDialog,
  }
}
