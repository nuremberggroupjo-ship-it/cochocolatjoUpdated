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

// Schema for deleting an category(s)
const deleteCategorySchema = z.object({
  id: z.union([z.string(), z.array(z.string())]), // Accepts either a single ID or an array of IDs
})

/**
 * Server action to delete one or more categories.
 * This action handles both single and bulk deletions, including associated image cleanup.
 */
export const deleteCategoryAction = actionClient
  .metadata({
    actionName: "deleteCategoryAction", // Metadata for the action
  })
  .inputSchema(deleteCategorySchema, {
    // Handle validation errors and flatten them for client-side display
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    await verifySession({ isAdmin: true }) // Ensure the user is an admin

    const { id } = parsedInput // Destructure the input to get the ID(s)
    const categoryIds = Array.isArray(id) ? id : [id]
    const utapi = new UTApi()

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch all categories with their relations
        const categories = await tx.category.findMany({
          where: { id: { in: categoryIds } },
          include: {
            products: true, // Check for associated products
          },
        })

        if (categories.length === 0) {
          throw new Error(
            API_RESPONSE_MESSAGES.NOT_FOUND(
              categoryIds.length > 1 ? "Categories" : "Category",
              categoryIds.join(", "),
            ),
          )
        }

        // 2. Check if any categories have associated products
        const categoriesWithProducts = categories.filter(
          (c) => c.products.length > 0,
        )
        if (categoriesWithProducts.length > 0) {
          const categoryNames = categoriesWithProducts
            .map((c) => c.name)
            .join(", ")
          throw new Error(
            `Cannot delete categories: "${categoryNames}" because they have associated products. Please reassign or delete the products first.`,
          )
        }

        // 3. Collect all  image URLs before deletion
        // Thumbnail images
        const allThumbnailImageUrls = categories
          .filter((category) => category.thumbnailImage) // Only categories with thumbnails
          .map((category) => category.thumbnailImage)
        // Cover images
        const allCoverImageUrls = categories
          .filter((category) => category.coverImage) // Only categories with cover images
          .map((category) => category.coverImage)

        // 4. Delete all categories (no relations to delete for categories in this schema)
        await tx.category.deleteMany({
          where: { id: { in: categoryIds } },
        })

        return {
          deletedCategories: categories,
          imageUrls: [...allThumbnailImageUrls, ...allCoverImageUrls],
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
          // Don't throw error here - categories are already deleted from DB
        }
      }

      revalidateTag(REVALIDATE_TAGS.CATEGORIES)

      // Return appropriate success message
      if (result.deletedCategories.length === 1) {
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(
            result.deletedCategories[0].name,
          ),
        }
      } else {
        const names = extractAndJoin(result.deletedCategories, "name")
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(names),
        }
      }
    } catch (error) {
      console.error("Category deletion error:", error)
      throw error
    }
  })
