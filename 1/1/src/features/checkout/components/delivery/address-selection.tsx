"use client"

import { FC, useMemo, useState } from "react"

import { Edit2Icon, MapPin, Plus, StarIcon, Trash2Icon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { FieldError } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { DIALOG_TEXTS } from "@/constants"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { AppResponsiveModal } from "@/components/shared/app-responsive-modal"
import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

import {
  deleteAddress,
  setDefaultAddress,
} from "@/features/checkout/actions/address.actions"
import { AddressDialog } from "@/features/checkout/components/delivery/address-dialog"
import type { AddressSchema } from "@/features/checkout/schemas/address.schema"

interface AddressSelectionProps {
  addresses: AddressSchema[]
  selectedAddressId?: string | null
  onAddressSelect: (addressId: string) => void
  onClearAddressSelection: () => void
  addressFormError?: FieldError
}

export const AddressSelection: FC<AddressSelectionProps> = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onClearAddressSelection,
  addressFormError,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  // Action to delete address
  const { execute: executeDeleteAddress, isPending: isDeletingAddress } =
    useAction(deleteAddress, {
      onSuccess: (args) => {
        setAddressToDelete(null)
        setIsDeleteDialogOpen(false)
        onClearAddressSelection()
        toast.success(args.data?.message)
      },
      onError: (args) => {
        toast.error(args.error.serverError)
      },
    })

  // Action to set default address
  const {
    execute: executeSetDefaultAddress,
    isPending: isSettingDefaultAddress,
  } = useAction(setDefaultAddress, {
    onSuccess: (args) => {
      toast.success(args.data?.message)
    },
    onError: (args) => {
      toast.error(args.error.serverError)
    },
  })

  const isPending = isDeletingAddress || isSettingDefaultAddress

  const [editingAddress, setEditingAddress] = useState<
    AddressSchema | undefined
  >()
  const [addressToDelete, setAddressToDelete] = useState<AddressSchema | null>(
    null,
  )

  const handleAddAddress = () => {
    setEditingAddress(undefined)
    setIsSaveDialogOpen(true)
  }

  const handleEditAddress = (address: AddressSchema) => {
    setEditingAddress(address)
    setIsSaveDialogOpen(true)
  }

  const handleDeleteAddress = (address: AddressSchema) => {
    setAddressToDelete(address)
    setIsDeleteDialogOpen(true)
  }

  const defaultValues: Partial<AddressSchema> = useMemo(
    () => ({
      id: editingAddress?.id || undefined,
      name: editingAddress?.name || "",
      city: editingAddress?.city,
      street: editingAddress?.street || "",
      area: editingAddress?.area || "",
      buildingNumber: editingAddress?.buildingNumber || "",
      apartmentNumber: editingAddress?.apartmentNumber || "",
      isDefault: editingAddress?.isDefault || false,
    }),
    [editingAddress],
  )

  return (
    <>
      <div className="space-y-2">
        <Card
          className={cn(
            "shadow-none",
            addressFormError ? "border-destructive" : "border-border",
          )}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Your Addresses
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAddress}
                className="flex items-center gap-2"
              >
                <Plus className="size-4" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <MapPin className="text-primary mx-auto mb-4 size-12" />
                <p className="text-primary mb-4">No addresses saved yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "cursor-pointer rounded-lg border p-4 transition-all",
                      selectedAddressId === address.id
                        ? "ring-primary border-primary bg-primary/5 shadow-sm ring-1"
                        : "border-border hover:border-primary/50",
                    )}
                    onClick={() => onAddressSelect(address.id!)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-medium">{address.name}</h4>
                          {address.isDefault && (
                            <Badge variant="warning">Default</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {address.street}, {address.area}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {address.city}, Building {address.buildingNumber}
                          {address.apartmentNumber &&
                            `, Apt ${address.apartmentNumber}`}
                        </p>
                      </div>

                      {/* Action Icon Buttons */}
                      <div className="flex flex-col items-center gap-1 md:flex-row">
                        {!address.isDefault && (
                          <ButtonWithTooltip
                            tooltipContent="Set as default address"
                            className="text-warning hover:text-warning"
                            disabled={isPending}
                            onClick={() => {
                              executeSetDefaultAddress({
                                addressId: address.id!,
                              })
                            }}
                          >
                            <StarIcon className="size-4" />
                          </ButtonWithTooltip>
                        )}

                        <ButtonWithTooltip
                          tooltipContent="Edit address"
                          className="text-info hover:text-info"
                          disabled={isPending}
                          onClick={() => {
                            handleEditAddress(address)
                          }}
                        >
                          <Edit2Icon className="size-4" />
                        </ButtonWithTooltip>

                        <ButtonWithTooltip
                          tooltipContent="Delete address"
                          className="text-destructive hover:text-destructive"
                          disabled={isPending}
                          onClick={() => {
                            handleDeleteAddress(address)
                          }}
                        >
                          <Trash2Icon className="size-4" />
                        </ButtonWithTooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {addressFormError && (
          <p className="text-destructive text-sm">
            {addressFormError?.message}
          </p>
        )}
      </div>
      {/* Address Dialog */}
      <AddressDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        defaultValues={defaultValues}
        isEditing={editingAddress !== undefined}
      />

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <AppResponsiveModal
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onAction={() =>
            executeDeleteAddress({ addressId: addressToDelete?.id as string })
          }
          isActionLoading={isDeletingAddress}
          description={DIALOG_TEXTS.DELETE_CONFIRMATION.DESCRIPTION(
            addressToDelete?.name,
          )}
          showTrigger={false}
          isDescriptionHtml
        />
      )}
    </>
  )
}
