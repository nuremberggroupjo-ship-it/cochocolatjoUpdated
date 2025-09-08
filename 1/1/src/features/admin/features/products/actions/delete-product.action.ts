"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { UTApi } from "uploadthing/server"
import { z } from "zod"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"
import { extractAndJoin } from "@/lib/utils"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { extractFileKeyFromUrl } from "@/features/admin/lib/utils"

// Schema for deleting an product(s)
const deleteProductSchema = z.object({
  id: z.union([z.string(), z.array(z.string())]), // Accepts either a single ID or an array of IDs
})

/**
 * Server action to delete one or more products.
 * Uses bulk operations for efficiency while maintaining data integrity.
 */
export const deleteProductAction = actionClient
  .metadata({
    actionName: "deleteProductAction",
  })
  .inputSchema(deleteProductSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    await verifySession({ isAdmin: true })

    const { id } = parsedInput
    const productIds = Array.isArray(id) ? id : [id]
    const utapi = new UTApi()

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch all products with their relations
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
          include: {
            productImages: true,
            attributes: true,
            orderItems: true, // Check for order history
          },
        })

        if (products.length === 0) {
          throw new Error(
            API_RESPONSE_MESSAGES.NOT_FOUND(
              productIds.length > 1 ? "Products" : "Product",
              productIds.join(", "),
            ),
          )
        }

        // 2. Check if any products have order history
        const productsWithOrders = products.filter(
          (p) => p.orderItems.length > 0,
        )
        if (productsWithOrders.length > 0) {
          const productNames = productsWithOrders.map((p) => p.name).join(", ")
          throw new Error(
            `Cannot delete products: "${productNames}" because they have order history. Consider marking them as inactive instead.`,
          )
        }

        // 3. Collect all image URLs before deletion
        const allImageUrls = products.flatMap((product) =>
          product.productImages.map((productImage) => productImage.imageUrl),
        )

        // 4. Delete all relations using bulk operations (order matters for foreign keys)

        // Delete cart items
        await tx.cartItem.deleteMany({
          where: { productId: { in: productIds } },
        })

        // Delete favorites
        await tx.favorite.deleteMany({
          where: { productId: { in: productIds } },
        })

        // Delete product attributes (many-to-many relation)
        await tx.productAttribute.deleteMany({
          where: { productId: { in: productIds } },
        })

        // Delete product images
        await tx.productImage.deleteMany({
          where: { productId: { in: productIds } },
        })

        // 5. Finally, delete all products
        await tx.product.deleteMany({
          where: { id: { in: productIds } },
        })

        return {
          deletedProducts: products,
          imageUrls: allImageUrls,
        }
      })

      // 6. Delete images from UploadThing (outside transaction)
      if (result.imageUrls.length > 0) {
        const fileKeys = result.imageUrls.map((url) =>
          extractFileKeyFromUrl(url),
        )
        try {
          await utapi.deleteFiles(fileKeys)
        } catch (error) {
          console.error("Failed to delete images from UploadThing:", error)
          // Don't throw error here - products are already deleted from DB
        }
      }

      revalidateTag(REVALIDATE_TAGS.PRODUCTS)

      // Return appropriate success message
      if (result.deletedProducts.length === 1) {
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(
            result.deletedProducts[0].name,
          ),
        }
      } else {
        const names = extractAndJoin(result.deletedProducts, "name")
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(names),
        }
      }
    } catch (error) {
      console.error("Product deletion error:", error)
      throw error
    }
  })
