"use client"

import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  StoreIcon,
  TruckIcon,
} from "lucide-react"

import type { CustomerOrderDetailsData } from "@/types/db"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { STORE_PICKUP_INFO } from "@/features/order-details/constants"

export const DeliveryDetailsCard = ({
  shippingAddress,
  deliveryType,
  isPaid,
  paymentMethod,
}: Pick<
  CustomerOrderDetailsData,
  "shippingAddress" | "deliveryType" | "isPaid" | "paymentMethod"
>) => {
  const parsedShippingAddress = shippingAddress
    ? typeof shippingAddress === "string"
      ? JSON.parse(shippingAddress)
      : shippingAddress
    : null
  const isPickup = deliveryType === "PICKUP"

  const handleDirections = () => {
    window.open(STORE_PICKUP_INFO.location_link, "_blank")
  }

  const handleCallStore = () => {
    window.open(`tel:${STORE_PICKUP_INFO.phoneNumber}`, "_self")
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPickup ? (
            <StoreIcon className="size-5" />
          ) : (
            <TruckIcon className="size-5" />
          )}
          {isPickup ? "Pickup Details" : "Delivery Details"}
          <Badge variant="outline" className="ml-auto">
            {isPickup ? "Store Pickup" : "Home Delivery"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPickup ? (
          /* Store Pickup Information */
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              {/* Store Address */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="text-muted-foreground mt-0.5 size-4 flex-shrink-0" />

                  <p className="text-sm font-medium">
                    {STORE_PICKUP_INFO.location_label}
                  </p>
                </div>

                {/* Store Contact */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="text-muted-foreground size-4" />
                    <p
                      className="hover:text-primary text-sm hover:cursor-pointer"
                      onClick={handleCallStore}
                    >
                      {STORE_PICKUP_INFO.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-2">
                  <ClockIcon className="text-muted-foreground size-4" />
                  <span className="text-sm">
                    {STORE_PICKUP_INFO.openingHours}
                  </span>
                </div>
              </div>

              {/* Directions Button */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDirections}
                  className="w-full"
                >
                  <MapPinIcon className="mr-2 size-4" />
                  Get Directions
                </Button>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Pickup Instructions</h4>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>• Please bring your order number</p>
                <p>• Your order will be ready during store operating hours</p>
                <p>• Call us if you need to reschedule your pickup</p>
                {!isPaid && paymentMethod === "CASH_ON_DELIVERY" && (
                  <p>
                    • Payment can be made at pickup (cash or cliq or visa
                    accepted)
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Home Delivery Information */
          <div className="space-y-4">
            {/* Delivery Address */}
            {parsedShippingAddress && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="text-muted-foreground size-4" />
                  <h4 className="text-sm font-medium">Delivery Address</h4>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="space-y-1">
                    {parsedShippingAddress.city && (
                      <p className="text-muted-foreground text-sm">
                        City:&nbsp;{parsedShippingAddress.city}
                      </p>
                    )}
                    {parsedShippingAddress.area && (
                      <p className="text-muted-foreground text-sm">
                        Area:&nbsp;{parsedShippingAddress.area}
                      </p>
                    )}
                    {parsedShippingAddress.street && (
                      <p className="text-muted-foreground text-sm">
                        Street:&nbsp;{parsedShippingAddress.street}
                      </p>
                    )}
                    {parsedShippingAddress.buildingNumber && (
                      <p className="text-muted-foreground text-sm">
                        Building Number:&nbsp;
                        {parsedShippingAddress.buildingNumber}
                      </p>
                    )}
                    {parsedShippingAddress.apartmentNumber && (
                      <p className="text-muted-foreground text-sm">
                        Apartment Number:&nbsp;
                        {parsedShippingAddress.apartmentNumber}
                      </p>
                    )}

                    {parsedShippingAddress.country && (
                      <p className="text-sm">{parsedShippingAddress.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Instructions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Delivery Information</h4>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>• Estimated delivery time: 30-45 minutes</p>
                <p>• Our delivery team will call before arrival</p>
                <p>• Please ensure someone is available to receive the order</p>
                {!isPaid && paymentMethod === "CASH_ON_DELIVERY" && (
                  <p>
                    • Payment will be collected upon delivery (cash or cliq)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
