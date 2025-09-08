"use server"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"

import { API_RESPONSE_MESSAGES } from "@/constants"

export const deleteProductImageAction = async (imageId: string) => {
  await verifySession({ isAdmin: true }) // Ensure the user is an admin

  // Delete the product from the database
  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  })

  // Return success message with the deleted product's image
  return {
    message: API_RESPONSE_MESSAGES.DELETED_SUCCESS("image"),
  }
}
