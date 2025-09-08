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

// Schema for deleting banner(s)
const deleteBannerSchema = z.object({
  id: z.union([z.string(), z.array(z.string())]), // Accepts either a single ID or an array of IDs
})

/**
 * Server action to delete one or more banners.
 * Uses bulk operations for efficiency while maintaining data integrity.
 */
export const deleteBannerAction = actionClient
  .metadata({
    actionName: "deleteBannerAction",
  })
  .inputSchema(deleteBannerSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    await verifySession({ isAdmin: true })

    const { id } = parsedInput
    const bannerIds = Array.isArray(id) ? id : [id]
    const utapi = new UTApi()

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch all banners
        const banners = await tx.banner.findMany({
          where: { id: { in: bannerIds } },
        })

        if (banners.length === 0) {
          throw new Error(
            API_RESPONSE_MESSAGES.NOT_FOUND(
              bannerIds.length > 1 ? "Banners" : "Banner",
              bannerIds.join(", "),
            ),
          )
        }

        // 2. Collect all image URLs before deletion
        const allImageUrls = banners
          .filter((banner) => banner.image) // Only banners with images
          .map((banner) => banner.image)

        // 3. Delete all banners (no relations to delete for banners)
        await tx.banner.deleteMany({
          where: { id: { in: bannerIds } },
        })

        return {
          deletedBanners: banners,
          imageUrls: allImageUrls,
        }
      })

      // 4. Delete images from UploadThing (outside transaction)
      if (result.imageUrls.length > 0) {
        const fileKeys = result.imageUrls.map((url) =>
          extractFileKeyFromUrl(url),
        )
        try {
          await utapi.deleteFiles(fileKeys)
        } catch (error) {
          console.error("Failed to delete images from UploadThing:", error)
          // Don't throw error here - banners are already deleted from DB
        }
      }

      revalidateTag(REVALIDATE_TAGS.BANNERS)

      // Return appropriate success message
      if (result.deletedBanners.length === 1) {
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(
            result.deletedBanners[0].name,
          ),
        }
      } else {
        const names = extractAndJoin(result.deletedBanners, "name")
        return {
          message: API_RESPONSE_MESSAGES.DELETED_SUCCESS(names),
        }
      }
    } catch (error) {
      console.error("Banner deletion error:", error)
      throw error
    }
  })
