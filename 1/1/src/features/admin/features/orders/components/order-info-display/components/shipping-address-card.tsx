import { MapPinIcon } from "lucide-react"

import type { OrderAdminData } from "@/types/db"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const ShippingAddressCard = (
  props: Pick<OrderAdminData, "shippingAddress">,
) => {
  const { shippingAddress } = props

  // Parse shipping address if it exists
  const parsedShippingAddress = shippingAddress
    ? typeof shippingAddress === "string"
      ? JSON.parse(shippingAddress)
      : shippingAddress
    : null

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="size-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{parsedShippingAddress?.name}</p>
          <p className="text-muted-foreground text-sm">
            {parsedShippingAddress?.city}, {parsedShippingAddress?.area}
          </p>
          <p className="text-muted-foreground text-sm">
            {parsedShippingAddress?.street}
          </p>
          <p className="text-muted-foreground text-sm">
            Building no. {parsedShippingAddress?.buildingNumber}
            {parsedShippingAddress?.apartmentNumber &&
              `, Apartment no. ${parsedShippingAddress?.apartmentNumber}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
