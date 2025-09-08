"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getBannerBySlugAdmin } from "@/data"

import { Banner } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveBannerSchema } from "@/features/admin/features/banners/lib/banner.schema"

/**
 * Server action to save or update an banner.
 * This action handles both creating a new banner and updating an existing one.
 */
export const saveBannerAction = actionClient
  .metadata({
    actionName: "saveBannerAction", // Metadata for the action
  })
  .inputSchema(saveBannerSchema, {
    // Handle validation errors and flatten them for client-side display
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[existingSlug: z.ZodString]>([z.string()]) // Bind additional arguments (e.g., existingSlug)
  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    await verifySession({ isAdmin: true }) // Ensure the user is an admin

    // Destructure inputs
    const existingSlug = bindArgsClientInputs[0] // Existing slug for updates
    const { id, name, slug, isActive, priority, image } = parsedInput // Parsed input data

    // Check if this is an update operation (id is provided)
    if (id) {
      // Fetch the existing banner by slug
      const existingBanner = await getBannerBySlugAdmin(existingSlug)
      if (!existingBanner) {
        throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("Banner", existingSlug))
      }

      // Check for slug conflicts (ensure the new slug is unique)
      const slugConflict = await getBannerBySlugAdmin(slug)
      if (slugConflict && slugConflict.id !== existingBanner.id) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Banner", slug))
      }

      // Update the banner in the database
      const updatedBanner = await prisma.banner.update({
        where: { slug: existingSlug },
        data: {
          name,
          slug,
          isActive,
          priority,
          image,
        },
      })

      // Revalidate the cache for the banners table
      revalidateTag(REVALIDATE_TAGS.BANNERS)

      // Return the updated banner
      return {
        result: updatedBanner as Banner, // Cast to Banner type
        message: API_RESPONSE_MESSAGES.UPDATED_SUCCESS(updatedBanner.name),
      }
    } else {
      // This is a create operation (no id provided)

      // Check if an banner with the same slug already exists
      const alreadyInUseBanner = await getBannerBySlugAdmin(slug)
      if (alreadyInUseBanner) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Banner", slug))
      }

      // Create a new banner in the database
      const newBanner = await prisma.banner.create({
        data: {
          name,
          slug,
          isActive,
          priority,
          image,
        },
      })

      // Revalidate the cache for the banners table
      revalidateTag(REVALIDATE_TAGS.BANNERS)

      // Return the newly created banner
      return {
        result: newBanner as Banner, // Cast to Banner type
        message: API_RESPONSE_MESSAGES.CREATED_SUCCESS(newBanner.name),
      }
    }
  })
