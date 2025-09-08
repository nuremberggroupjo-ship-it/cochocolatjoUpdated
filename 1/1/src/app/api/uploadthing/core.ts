import { type FileRouter, createUploadthing } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // Category
  category: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await verifySession({ isAdmin: true })

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {}
    })

    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
      }
    }),
  // Banner
  banner: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await verifySession({ isAdmin: true })

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {}
    })

    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
      }
    }),
  // attribute
  attribute: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await verifySession({ isAdmin: true })

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {}
    })

    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
      }
    }),
  // product
  product: f({ image: { maxFileSize: "2MB", maxFileCount: 4 } })
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await verifySession({ isAdmin: true })

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      const imageUrl = file.ufsUrl

      const productImage = await prisma.productImage.create({
        data: {
          imageUrl,
        },
      })

      return { imageId: productImage?.id }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
