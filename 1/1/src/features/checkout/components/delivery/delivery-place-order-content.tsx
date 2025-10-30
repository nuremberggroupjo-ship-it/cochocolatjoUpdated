"use client"

import { useRouter } from "next/navigation"

import {
  ArrowLeftIcon,
  CreditCardIcon,
  EditIcon,
  HomeIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { LoadingButton } from "@/components/shared/loading-button"

import { createDeliveryOrder } from "@/features/checkout/actions/delivery.actions"
import { PlaceOrderInfoField } from "@/features/checkout/components/place-order-info-field"
import { PAYMENT_METHODS } from "@/features/checkout/constants"
import { AddressSchema } from "@/features/checkout/schemas/address.schema"
import { DeliveryInfoFormData } from "@/features/checkout/schemas/delivery.schema"
import { type AvailablePaymentMethodType } from "@/features/checkout/schemas/payment-method.schema"

interface DeliveryPlaceOrderContentProps {
  deliveryInfo: DeliveryInfoFormData
  selectedAddress: AddressSchema
  paymentMethod: AvailablePaymentMethodType
}

export function DeliveryPlaceOrderContent({
  deliveryInfo,
  selectedAddress,
  paymentMethod,
}: DeliveryPlaceOrderContentProps) {
  const router = useRouter()

  const { isPending, execute } = useAction(createDeliveryOrder, {
    onSuccess(args) {
      router.push(`/checkout/success?orderNumber=${args.data?.orderNumber}`)
      toast.success(args.data?.message)
    },
    onError(args) {
      toast.error(args.error.serverError)
    },
  })

  // Get payment method details from constants
  const selectedPaymentMethod = PAYMENT_METHODS.find(
    (method) => method.value === paymentMethod,
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Combined Customer Information & Delivery Address */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="size-5" />
              Order Details
            </CardTitle>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => router.push("/checkout/delivery")}
              className="flex items-center gap-2"
            >
              <EditIcon className="size-4" />
              <span className="hidden sm:block">Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Customer Information</h3>
              <PlaceOrderInfoField
                icon={UserIcon}
                label="Name"
                value={deliveryInfo.name}
              />
              {deliveryInfo.email && (
                <PlaceOrderInfoField
                  icon={MailIcon}
                  label="Email"
                  value={deliveryInfo.email}
                />
              )}
              <PlaceOrderInfoField
                icon={PhoneIcon}
                label="Phone"
                value={deliveryInfo.phone}
              />

              {deliveryInfo.additionalNotes && (
                <PlaceOrderInfoField
                  icon={MessageSquareIcon}
                  label="Additional Notes"
                  value={deliveryInfo.additionalNotes}
                />
              )}
            </div>

            {/* Separator */}
            <Separator className="bg-border/50" />

            {/* Delivery Address Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Delivery Address</h3>

              <div className="flex items-start gap-3">
                <HomeIcon className="text-primary mt-1 size-4" />
                <div>
                  <p className="font-medium">{selectedAddress.name}</p>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>
                      City: &nbsp;
                      <span className="text-foreground">
                        {selectedAddress.city}
                      </span>
                    </p>
                    <p>
                      Area: &nbsp;
                      <span className="text-foreground">
                        {selectedAddress.area}
                      </span>
                    </p>
                    <p>
                      Street: &nbsp;
                      <span className="text-foreground">
                        {selectedAddress.street}
                      </span>
                    </p>
                    <p>
                      Building: &nbsp;
                      <span className="text-foreground">
                        {selectedAddress.buildingNumber}
                      </span>
                    </p>
                    {selectedAddress.apartmentNumber && (
                      <p>
                        Apartment: &nbsp;
                        <span className="text-foreground">
                          {selectedAddress.apartmentNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="size-5" />
              Payment Method
            </CardTitle>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => router.push("/checkout/delivery/payment-method")}
              className="flex items-center gap-2"
            >
              <EditIcon className="size-4" />
              <span className="hidden sm:block">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {selectedPaymentMethod ? (
                <selectedPaymentMethod.icon className="text-primary size-4" />
              ) : (
                <CreditCardIcon className="text-primary size-4" />
              )}
              <div>
                <p className="font-medium">
                  {selectedPaymentMethod?.label || paymentMethod}
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedPaymentMethod?.description ||
                    "Selected payment method"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Place Order Button */}
      <div className="flex flex-col justify-start gap-2 sm:flex-row">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/checkout/delivery/payment-method")}
          size="lg"
          className="flex cursor-pointer items-center gap-2"
          disabled={isPending}
        >
          <ArrowLeftIcon className="size-4" />
          Back to Payment
        </Button>
        <LoadingButton
          onClick={() => execute({ deliveryInfo })}
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
