"use client"

import { FC, useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { BuildingIcon, MapPinIcon, UserIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { saveAddress } from "@/features/checkout/actions/address.actions"
import { JORDAN_CITIES } from "@/features/checkout/constants"
import {
  type AddressSchema,
  addressSchema,
} from "@/features/checkout/schemas/address.schema"

interface AddressDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: Partial<AddressSchema>
  isEditing?: boolean
}

export const AddressDialog: FC<AddressDialogProps> = ({
  isOpen,
  onOpenChange,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues,
  })

  const { execute, isPending } = useAction(saveAddress, {
    onSuccess: (args) => {
      toast.success(args.data?.message)
      onOpenChange(false)
      form.reset()
    },
    onError: (args) => {
      toast.error(args.error.serverError)
    },
  })

  // Reset form when address changes (for editing different addresses)
  useEffect(() => {
    const newDefaults: Partial<AddressSchema> = {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || "",
      city: defaultValues?.city,
      street: defaultValues?.street || "",
      area: defaultValues?.area || "",
      buildingNumber: defaultValues?.buildingNumber || "",
      apartmentNumber: defaultValues?.apartmentNumber || "",
      isDefault: defaultValues?.isDefault || false,
    }
    form.reset(newDefaults)
  }, [defaultValues, form])

  const onSubmit = async (values: AddressSchema) => {
    execute(values)
  }

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!isPending) {
          onOpenChange(open)
        }
      }}
    >
      <ResponsiveModalContent className="space-y-4 sm:space-y-2 lg:space-y-0">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            {isEditing ? "Edit Address" : "Add New Address"}
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            {isEditing
              ? "Update your address details below."
              : "Please enter your address details below."}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFormLabel label="Address Name" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="text-primary absolute top-2.5 left-3 size-4" />
                      <Input
                        placeholder="e.g., Home, Office, etc."
                        className="pl-10"
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              {/* City Field */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFormLabel label="City" />
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="relative w-full pl-10"
                          disabled={isPending}
                        >
                          <BuildingIcon className="text-primary absolute left-3 size-4" />

                          <SelectValue
                            placeholder="Select a city"
                            className="pl-7"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {JORDAN_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Area Field */}
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFormLabel label="Area" />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPinIcon className="text-primary absolute top-2.5 left-3 size-4" />
                        <Input
                          placeholder="Enter area/district"
                          className="pl-10"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Street Field */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFormLabel label="Street" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPinIcon className="text-primary absolute top-2.5 left-3 size-4" />
                      <Input
                        placeholder="Enter street name"
                        className="pl-10"
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              {/* Building Number Field */}
              <FormField
                control={form.control}
                name="buildingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFormLabel label="Building Number" />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BuildingIcon className="text-primary absolute top-2.5 left-3 size-4" />
                        <Input
                          placeholder="Enter building number"
                          className="pl-10"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Apartment Number Field */}
              <FormField
                control={form.control}
                name="apartmentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BuildingIcon className="text-primary absolute top-2.5 left-3 size-4" />
                        <Input
                          placeholder="Enter apartment number"
                          className="pl-10"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex items-start space-y-0 space-x-1",
                    isPending && "pointer-events-none",
                  )}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel className="inline-block cursor-pointer">
                      Set as default address
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <ResponsiveModalFooter className="gap-y-2">
              <ResponsiveModalClose asChild>
                <Button variant="outline" disabled={isPending} type="button">
                  Cancel
                </Button>
              </ResponsiveModalClose>
              <LoadingButton type="submit" isLoading={isPending}>
                {isEditing ? "Update" : "Add"}
              </LoadingButton>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
