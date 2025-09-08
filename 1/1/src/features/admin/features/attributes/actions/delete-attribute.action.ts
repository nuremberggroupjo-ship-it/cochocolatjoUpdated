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

// Schema for deleting attribute(s)
const deleteAttributeSchema = z.object({
  id: z.union([z.string(), z.array(z.string())]), // Accepts either a single ID or an array of IDs
})

/**
 * Server action to delete one or more attributes.
 * Uses bulk operations for efficiency while maintaining data integrity.
 */
export const deleteAttributeAction = actionClient
  .metadata({
    actionName: "deleteAttributeAction",
  })
  .inputSchema(deleteAttributeSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    await verifySession({ isAdmin: true })

    const { id } = parsedInput
    const attributeIds = Array.isArray(id) ? id : [id]
    const utapi = new UTApi()

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch all attributes with their product associations
        const attributes = await tx.attribute.findMany({
          where: { id: { in: attributeIds } },
          include: {
            products: {
              include: {
                product: true, // Include product details
              },
            },
          },
        })

        if (attributes.length === 0) {
          throw new Error(
            API_RESPONSE_MESSAGES.NOT_FOUND(
              attributeIds.length > 1 ? "Attributes" : "Attribute",
              attributeIds.join(", "),
            ),
          )
        }

        // 2. Check if any attributes have associated products (PREVENT DELETION)
        const attributesWithProducts = attributes.filter(
          (attr) => attr.products.length > 0,
        )
        if (attributesWithProducts.length > 0) {
          const attributeNames = attributesWithProducts
            .map((attr) => attr.name)
            .join(", ")
          throw new Error(
            `Cannot delete attributes: "${attributeNames}" because they are associated with products. Please remove these attributes from products first.`,
          )
        }

        // 3. Collect all image URLs before deletion
        const allImageUrls = attributes
          .filter((attribute) => attribute.image) // Only attributes with images
          .map((attribute) => attribute.image)

        // 4. Delete all attributes (no need to delete ProductAttribute relations since they don't exist)
        await tx.attribute.deleteMany({
          where: { id: { in: attributeIds } },
        })

        return {
          deletedAttributes: attributes,
          imageUrls: allImageUrls,
        }
      })

      // 5. Delete images from UploadThing (outside transaction)
      if (result.imageUrls.length > 0) {
        const fileKeys = result.imageUrls.map((url) =>
          extractFileKeyFromUrl(url),
        )
        try {
          await utapi.deleteFiles(fileKeys)
        } catch (error) {
          console.error("Failed to delete images from UploadThing:", error)
          // Don't throw error here - attributes are already deleted from DB
        }
      }

      revalidateTag(REVALIDATE_TAGS.ATTRIBUTES)

      // Return appropriate success message
      if (result.deletedAttributes.length === 1) {
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(
            result.deletedAttributes[0].name,
          ),
        }
      } else {
        const names = extractAndJoin(result.deletedAttributes, "name")
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(names),
        }
      }
    } catch (error) {
      console.error("Attribute deletion error:", error)
      throw error
    }
  })
