"use client"

import { Button } from "@/components/ui/button"
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal"

import { LoadingButton } from "@/components/shared/loading-button"

import { type OrderSaveReturn } from "@/features/admin/features/orders/hooks/use-order-save"

interface OrderConfirmationModelProps {
  orderSave: OrderSaveReturn
}

export const OrderConfirmationModel = ({
  orderSave,
}: OrderConfirmationModelProps) => {
  const {
    currentWarnings,
    handleCancelSubmit,
    handleConfirmSubmit,
    isPending,
    setShowWarningDialog,
    showWarningDialog,
  } = orderSave

  return (
    <ResponsiveModal
      open={showWarningDialog}
      onOpenChange={setShowWarningDialog}
    >
      <ResponsiveModalContent className="space-y-4 sm:space-y-2 lg:space-y-0">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            <span className="text-amber-600">⚠️</span>
            Business Logic Warning
          </ResponsiveModalTitle>

          <ResponsiveModalDescription>
            The following warnings were detected with your changes. Please
            review before continuing.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="py-4">
          <ul className="space-y-2 text-sm">
            {currentWarnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 text-amber-500">•</span>
                <span className="text-gray-700">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
        <ResponsiveModalFooter className="gap-y-2">
          <ResponsiveModalClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSubmit}
              disabled={isPending}
            >
              Cancel
            </Button>
          </ResponsiveModalClose>

          <LoadingButton
            onClick={handleConfirmSubmit}
            isLoading={isPending}
            variant="default"
          >
            Continue Anyway
          </LoadingButton>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
