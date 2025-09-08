"use client"

import { useCallback, useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TruckIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AddressSelection } from "@/features/checkout/components/delivery/address-selection"
import { DeliveryInfoContentForm } from "@/features/checkout/components/delivery/delivery-info-content-form"
import type { AddressSchema } from "@/features/checkout/schemas/address.schema"
import {
  type DeliveryInfoFormData,
  deliveryInfoSchema,
} from "@/features/checkout/schemas/delivery.schema"

interface DeliveryInfoContentProps {
  defaultValues: DeliveryInfoFormData
  addresses: AddressSchema[]
  defaultAddressId?: string | null
}

export function DeliveryInfoContent({
  defaultValues,
  addresses,
  defaultAddressId,
}: DeliveryInfoContentProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | null | undefined
  >(defaultAddressId)

  const form = useForm<DeliveryInfoFormData>({
    resolver: zodResolver(deliveryInfoSchema),
    defaultValues,
  })

  // Set initial selected address and form value on component mount
  useEffect(() => {
    if (defaultAddressId && addresses.length > 0) {
      setSelectedAddressId(defaultAddressId)
      form.setValue("selectedAddressId", defaultAddressId)
    }
  }, [defaultAddressId, addresses.length, form])

  // Sync selected address when addresses change (for dynamic updates)
  useEffect(() => {
    const currentDefault = addresses.find((addr) => addr.isDefault)?.id

    // On initial load, if we have a default address and no form value is set
    if (currentDefault && !form.getValues("selectedAddressId")) {
      setSelectedAddressId(currentDefault)
      form.setValue("selectedAddressId", currentDefault)
      form.clearErrors("selectedAddressId")
      return
    }

    // On subsequent updates, only update if the current selection doesn't exist anymore
    if (selectedAddressId) {
      const currentSelectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId,
      )

      // If current selection doesn't exist (was deleted), update to new default
      if (!currentSelectedAddress && currentDefault) {
        setSelectedAddressId(currentDefault)
        form.setValue("selectedAddressId", currentDefault)
        form.clearErrors("selectedAddressId")
      }
    }
  }, [addresses, defaultAddressId, selectedAddressId, form])

  const handleAddressSelect = useCallback(
    (addressId: string) => {
      setSelectedAddressId(addressId)
      form.setValue("selectedAddressId", addressId)
      form.clearErrors("selectedAddressId")
    },
    [form],
  )

  const handleClearAddressSelection = useCallback(() => {
    setSelectedAddressId(null)
    form.setValue("selectedAddressId", "")
  }, [form])

  return (
    <div className="space-y-6">
      <AddressSelection
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onAddressSelect={handleAddressSelect}
        onClearAddressSelection={handleClearAddressSelection}
        addressFormError={form.formState.errors.selectedAddressId}
      />

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="size-5" />
            Delivery Information
          </CardTitle>
          <CardDescription>
            Your personal information has been pre-filled. Please select a
            delivery address above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryInfoContentForm form={form} />
        </CardContent>
      </Card>
    </div>
  )
}
