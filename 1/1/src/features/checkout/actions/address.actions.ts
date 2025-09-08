"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getCurrentUserInfo } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import {
  type AddressSchema,
  addressSchema,
  deleteAddressSchema,
} from "@/features/checkout/schemas/address.schema"

/**
 * Save address - Add new or update existing based on ID presence
 */
export const saveAddress = actionClient
  .metadata({
    actionName: "saveAddress",
  })
  .inputSchema(addressSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, ...parsedData } }) => {
    const user = await getCurrentUserInfo()
    if (!user || !user.id) {
      throw new Error("Not authenticated")
    }

    const currentAddresses = (user?.addresses as AddressSchema[]) || []

    // If this is set as default, remove default from others
    if (parsedData.isDefault) {
      currentAddresses.forEach((address) => {
        address.isDefault = false
      })
    }

    let updatedAddresses: AddressSchema[]
    let savedAddress: AddressSchema
    let isUpdate = false

    if (id) {
      // Update existing address
      const addressIndex = currentAddresses.findIndex(
        (address) => address.id === id,
      )

      if (addressIndex === -1) {
        throw new Error("Address not found")
      }

      // Update the address
      savedAddress = {
        ...currentAddresses[addressIndex],
        ...parsedData,
        id,
        updatedAt: new Date().toISOString(),
      }

      currentAddresses[addressIndex] = savedAddress
      updatedAddresses = currentAddresses
      isUpdate = true
    } else {
      // Create new address
      savedAddress = {
        id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: parsedData.name,
        city: parsedData.city,
        street: parsedData.street,
        area: parsedData.area,
        buildingNumber: parsedData.buildingNumber,
        apartmentNumber: parsedData.apartmentNumber || "",
        isDefault: parsedData.isDefault || currentAddresses.length === 0, // First address is default
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      updatedAddresses = [...currentAddresses, savedAddress]
    }

    // Update user with addresses
    await prisma.user.update({
      where: { id: user.id },
      data: {
        addresses: updatedAddresses,
      },
    })

    revalidateTag("user-addresses")

    return {
      success: true,
      address: savedAddress,
      message: `The address "${savedAddress.name}" was ${isUpdate ? "updated" : "added"} successfully`,
    }
  })

/**
 * Delete address
 */
export const deleteAddress = actionClient
  .metadata({
    actionName: "deleteAddress",
  })
  .inputSchema(deleteAddressSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const user = await getCurrentUserInfo()
    if (!user || !user.id) {
      throw new Error("Not authenticated")
    }

    const currentAddresses = (user?.addresses as AddressSchema[]) || []
    const addressToDelete = currentAddresses.find(
      (address: AddressSchema) => address.id === parsedInput.addressId,
    )

    if (!addressToDelete) {
      throw new Error("Address not found")
    }

    // Remove the address
    const updatedAddresses = currentAddresses.filter(
      (address: AddressSchema) => address.id !== parsedInput.addressId,
    )

    // If the deleted address was default and there are other addresses, make the first one default
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        addresses: updatedAddresses,
      },
    })

    revalidateTag("user-addresses")

    return {
      success: true,
      data: addressToDelete.name,
      message: `The address "${addressToDelete.name}" was deleted successfully`,
    }
  })

/**
 * Set default address
 */
export const setDefaultAddress = actionClient
  .metadata({
    actionName: "setDefaultAddress",
  })
  .inputSchema(
    z.object({
      addressId: z.string(),
    }),
    {
      handleValidationErrorsShape: async (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    },
  )
  .action(async ({ parsedInput }) => {
    const user = await getCurrentUserInfo()
    if (!user || !user.id) {
      throw new Error("Not authenticated")
    }

    const currentAddresses = (user?.addresses as AddressSchema[]) || []

    // Remove default from all addresses and set the selected one as default
    currentAddresses.forEach((address: AddressSchema) => {
      address.isDefault = address.id === parsedInput.addressId
      if (address.id === parsedInput.addressId) {
        address.updatedAt = new Date().toISOString()
      }
    })

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        addresses: currentAddresses,
      },
    })

    revalidateTag("user-addresses")

    return {
      success: true,
      message: "Default address updated successfully",
    }
  })
