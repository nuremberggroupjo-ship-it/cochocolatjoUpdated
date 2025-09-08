"use client"

import { useRouter } from "next/navigation"

import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LoadingButton } from "@/components/shared/loading-button"

import { createPickupOrder } from "@/features/checkout/actions/pick-up.actions"
import { PlaceOrderInfoField } from "@/features/checkout/components/place-order-info-field"
import { type PickupInfoSchema } from "@/features/checkout/schemas/pickup-info.schema"

interface PickupPlaceOrderContentProps {
  pickupInfo: PickupInfoSchema
}

export function PickupPlaceOrderContent({
  pickupInfo,
}: PickupPlaceOrderContentProps) {
  const router = useRouter()

  const { execute, isPending } = useAction(createPickupOrder, {
    onSuccess(args) {
      console.log(args.data)
      router.push(`/checkout/success?orderNumber=${args.data?.orderNumber}`)
      toast.success(args.data?.message)
    },
    onError(args) {
      toast.error(args.error.serverError)
    },
  })

  return (
    <div className="max-w-full space-y-6">
      {/* Order Review */}

      {/* Customer Information */}
      <Card className="gap-4 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="size-5" />
            Pickup Information
          </CardTitle>
          <Button
            size="sm"
            onClick={() => router.push("/checkout/pick-up")}
            className="flex items-center gap-2"
            disabled={isPending}
          >
            <EditIcon className="size-4" />
            <span className="hidden sm:block">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-hidden">
          <PlaceOrderInfoField
            icon={UserIcon}
            label="Name"
            value={pickupInfo.name}
          />

          {pickupInfo.email && (
            <PlaceOrderInfoField
              icon={MailIcon}
              label="Email"
              value={pickupInfo.email}
            />
          )}

          <PlaceOrderInfoField
            icon={PhoneIcon}
            label="Phone"
            value={pickupInfo.phone}
          />

          {pickupInfo.additionalNotes && (
            <PlaceOrderInfoField
              icon={MessageSquareIcon}
              label="Additional Notes"
              value={pickupInfo.additionalNotes}
            />
          )}
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="flex flex-col justify-start gap-2 sm:flex-row">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/checkout/pickup")}
          size="lg"
          className="flex cursor-pointer items-center gap-2"
          disabled={isPending}
        >
          <ArrowLeftIcon className="size-4" />
          Pickup info
        </Button>
        <LoadingButton
          onClick={() => {
            execute(pickupInfo)
          }}
          isLoading={isPending}
          type="button"
          size="lg"
          className="flex cursor-pointer items-center gap-2"
        >
          Place Order
        </LoadingButton>
      </div>
    </div>
  )
}
