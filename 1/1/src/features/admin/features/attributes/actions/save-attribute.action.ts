"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getAttributeBySlugAdmin } from "@/data"

import { Attribute } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveAttributeSchema } from "@/features/admin/features/attributes/lib/attribute.schema"

/**
 * Server action to save or update an attribute.
 * This action handles both creating a new attribute and updating an existing one.
 */
export const saveAttributeAction = actionClient
  .metadata({
    actionName: "saveAttributeAction", // Metadata for the action
  })
  .inputSchema(saveAttributeSchema, {
    // Handle validation errors and flatten them for client-side display
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[existingSlug: z.ZodString]>([z.string()]) // Bind additional arguments (e.g., existingSlug)
  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    await verifySession({ isAdmin: true }) // Ensure the user is an admin

    // Destructure inputs
    const existingSlug = bindArgsClientInputs[0] // Existing slug for updates
    const { id, name, slug, description, image } = parsedInput // Parsed input data

    // Check if this is an update operation (id is provided)
    if (id) {
      // Fetch the existing attribute by slug
      const existingAttribute = await getAttributeBySlugAdmin(existingSlug)
      if (!existingAttribute) {
        throw new Error(
          API_RESPONSE_MESSAGES.NOT_FOUND("Attribute", existingSlug),
        )
      }

      // Check for slug conflicts (ensure the new slug is unique)
      const slugConflict = await getAttributeBySlugAdmin(slug)
      if (slugConflict && slugConflict.id !== existingAttribute.id) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Attribute", slug))
      }

      // Update the attribute in the database
      const updatedAttribute = await prisma.attribute.update({
        where: { slug: existingSlug },
        data: {
          name,
          slug,
          description,
          image,
        },
      })

      // Revalidate the cache for the attributes table
      revalidateTag(REVALIDATE_TAGS.ATTRIBUTES)

      // Return the updated attribute
      return {
        result: updatedAttribute as Attribute, // Cast to Attribute type
        message: API_RESPONSE_MESSAGES.UPDATED_SUCCESS(updatedAttribute.name),
      }
    } else {
      // This is a create operation (no id provided)

      // Check if an attribute with the same slug already exists
      const alreadyInUseAttribute = await getAttributeBySlugAdmin(slug)
      if (alreadyInUseAttribute) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Attribute", slug))
      }

      // Create a new attribute in the database
      const newAttribute = await prisma.attribute.create({
        data: {
          name,
          slug,
          description,
          image,
        },
      })

      // Revalidate the cache for the attributes table
      revalidateTag(REVALIDATE_TAGS.ATTRIBUTES)

      // Return the newly created attribute
      return {
        result: newAttribute as Attribute, // Cast to Attribute type
        message: API_RESPONSE_MESSAGES.CREATED_SUCCESS(newAttribute.name),
      }
    }
  })
