"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getCategoryBySlugAdmin } from "@/data"

import { Category } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveCategorySchema } from "@/features/admin/features/categories/lib/category.schema"

/**
 * Server action to save or update an category.
 * This action handles both creating a new category and updating an existing one.
 */
export const saveCategoryAction = actionClient
  .metadata({
    actionName: "saveCategoryAction", // Metadata for the action
  })
  .inputSchema(saveCategorySchema, {
    // Handle validation errors and flatten them for client-side display
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[existingSlug: z.ZodString]>([z.string()]) // Bind additional arguments (e.g., existingSlug)
  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    await verifySession({ isAdmin: true }) // Ensure the user is an admin

    // Destructure inputs
    const existingSlug = bindArgsClientInputs[0] // Existing slug for updates
    const {
      id,
      name,
      slug,
      isActive,
      description,
      coverImage,
      thumbnailImage,
    } = parsedInput // Parsed input data

    // Check if this is an update operation (id is provided)
    if (id) {
      // Fetch the existing category by slug
      const existingCategory = await getCategoryBySlugAdmin(existingSlug)
      if (!existingCategory) {
        throw new Error(
          API_RESPONSE_MESSAGES.NOT_FOUND("Category", existingSlug),
        )
      }

      // Check for slug conflicts (ensure the new slug is unique)
      const slugConflict = await getCategoryBySlugAdmin(slug)
      if (slugConflict && slugConflict.id !== existingCategory.id) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Category", slug))
      }

      // Update the category in the database
      const updatedCategory = await prisma.category.update({
        where: { slug: existingSlug },
        data: {
          name,
          slug,
          isActive,
          description,
          coverImage,
          thumbnailImage,
        },
      })

      // Revalidate the cache for the categories table
      revalidateTag(REVALIDATE_TAGS.CATEGORIES)

      // Return the updated category
      return {
        result: updatedCategory as Category, // Cast to Category type
        message: API_RESPONSE_MESSAGES.UPDATED_SUCCESS(updatedCategory.name),
      }
    } else {
      // This is a create operation (no id provided)

      // Check if an category with the same slug already exists
      const alreadyInUseCategory = await getCategoryBySlugAdmin(slug)
      if (alreadyInUseCategory) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Category", slug))
      }

      // Create a new category in the database
      const newCategory = await prisma.category.create({
        data: {
          name,
          slug,
          isActive,
          description,
          coverImage,
          thumbnailImage,
        },
      })

      // Revalidate the cache for the categories table
      revalidateTag(REVALIDATE_TAGS.CATEGORIES)

      // Return the newly created category
      return {
        result: newCategory as Category, // Cast to Category type
        message: API_RESPONSE_MESSAGES.CREATED_SUCCESS(newCategory.name),
      }
    }
  })
