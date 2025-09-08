"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getProductBySlugAdmin } from "@/data"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"
import { convertToPlainObject } from "@/lib/utils"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveProductSchema } from "@/features/admin/features/products/lib/product.schema"

/**
 * Server action to save or update an product.
 * This action handles both creating a new product and updating an existing one.
 */
export const saveProductAction = actionClient
  .metadata({
    actionName: "saveProductAction", // Metadata for the action
  })
  .inputSchema(saveProductSchema, {
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
      shortDescription,
      ingredients,
      price,
      discountPrice,
      isDiscountActive,
      stock,
      isFeatured,
      attributes,
      categoryId,
      size,
      unit,
      images,
    } = parsedInput // Parsed input data

    // Check if this is an update operation (id is provided)
    if (id) {
      // Fetch the existing product by slug
      const existingProduct = await getProductBySlugAdmin(existingSlug)
      if (!existingProduct) {
        throw new Error(
          API_RESPONSE_MESSAGES.NOT_FOUND("Product", existingSlug),
        )
      }

      // Check for slug conflicts (ensure the new slug is unique)
      const slugConflict = await getProductBySlugAdmin(slug)
      if (slugConflict && slugConflict.id !== existingProduct.id) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Product", slug))
      }

      const updatedProduct = await prisma.$transaction(async (tx) => {
        // First, disconnect ALL current images from this product
        await tx.productImage.updateMany({
          where: { productId: existingProduct.id },
          data: { productId: null },
        })

        // Then connect the selected images to this product
        await tx.productImage.updateMany({
          where: {
            id: { in: images.map((image) => image.id) },
          },
          data: { productId: existingProduct.id },
        })

        // Update the product data
        const product = await tx.product.update({
          where: { slug: existingSlug },
          data: {
            name,
            slug,
            isActive,
            description,
            shortDescription,
            ingredients,
            price,
            discountPrice: isDiscountActive ? discountPrice : null, // Set discount price only if active
            isDiscountActive,
            stock,
            isFeatured,
            categoryId,
            size,
            unit,
            attributes: {
              deleteMany: {},
              create:
                attributes?.map((attributeId) => ({
                  attributeId: attributeId,
                })) || [],
            },
          },
          include: {
            attributes: {
              include: {
                attribute: true,
              },
            },
            productImages: true,
            category: true,
          },
        })

        return product
      })

      // Revalidate the cache for the products table
      revalidateTag(REVALIDATE_TAGS.PRODUCTS)

      // Return the updated product
      return {
        result: convertToPlainObject(updatedProduct),
        message: API_RESPONSE_MESSAGES.UPDATED_SUCCESS(updatedProduct.name),
      }
    } else {
      // This is a create operation (no id provided)

      // Check if an product with the same slug already exists
      const alreadyInUseProduct = await getProductBySlugAdmin(slug)
      if (alreadyInUseProduct) {
        throw new Error(API_RESPONSE_MESSAGES.ALREADY_EXISTS("Product", slug))
      }

      // Create a new product in the database
      const newProduct = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          shortDescription,
          ingredients,
          price,
          stock,
          isActive,
          isFeatured,
          categoryId, // One-to-many: Product belongs to one Category
          size,
          unit,
          discountPrice: isDiscountActive ? discountPrice : null, // Set discount price only if active
          isDiscountActive,
          // Create product attributes (many-to-many relation)
          attributes: {
            create:
              attributes?.map((attributeId) => ({
                attributeId: attributeId,
              })) || [],
          },

          // Create product images (one-to-many relation)
          productImages: {
            connect: images.map((image) => ({
              id: image.id,
              imageUrl: image.url,
            })),
          },
        },

        include: {
          attributes: {
            include: {
              attribute: true,
            },
          },
          productImages: true,
          category: true,
        },
      })

      // Revalidate the cache for the products table
      revalidateTag(REVALIDATE_TAGS.PRODUCTS)

      // Return the newly created product
      return {
        result: convertToPlainObject(newProduct),
        message: API_RESPONSE_MESSAGES.CREATED_SUCCESS(newProduct.name),
      }
    }
  })
