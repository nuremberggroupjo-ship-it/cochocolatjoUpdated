"use client"

import { TransitionStartFunction, useState } from "react"

import axios from "axios"
import { toast } from "sonner"

import { handleUploadthingError, useUploadThing } from "@/lib/uploadthing"
import { slugify } from "@/lib/utils"

import { deleteProductImageAction } from "@/features/admin/features/products/actions/delete-product-image.action"

export interface Attachment {
  file: File
  imageId?: string
  url?: string
  isUploading: boolean
}

type ProductImageUploadOptions = {
  /**
   * Callback function called when uploads complete successfully
   */
  onUploadComplete?: (attachments: Attachment[]) => void
  /**
   * Callback function called when uploads fails
   */
  onUploadError?: (error: string) => void
  onRemoveImageComplete?: (imageId: string) => void
  currentImagesLength?: number
  startRemoveImageTransition: TransitionStartFunction
}

export function useProductImageUpload({
  onUploadComplete,
  onUploadError,
  onRemoveImageComplete,
  startRemoveImageTransition,
  currentImagesLength = 0,
}: ProductImageUploadOptions) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>()
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { startUpload, isUploading, routeConfig } = useUploadThing("product", {
    // Called before upload begins, allows renaming files
    onBeforeUploadBegin(files) {
      setUploadError(null) // Reset any previous errors
      setUploadProgress(0) // Reset progress for new upload

      // Before upload begins, rename the files for consistency and uniqueness
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop() ?? "dat" // fallback extension
        const baseName = file.name.replace(/\.[^/.]+$/, "") // remove extension
        const safeName = slugify(baseName) // make name URL-safe
        const newFileName = `product-${safeName}-${crypto.randomUUID()}.${extension}`

        return new File([file], newFileName, { type: file.type })
      })

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ])

      return renamedFiles
    },

    // Updates upload progress
    onUploadProgress: setUploadProgress,

    // Called when upload completes successfully
    onClientUploadComplete(res) {
      if (!res?.length) return

      setAttachments((prev) => {
        const uploadedAttachments = prev.map((attachment) => {
          const matchingResponse = res.find(
            (r) => r.name === attachment.file.name,
          )

          if (matchingResponse) {
            return {
              ...attachment,
              isUploading: false,
              url: matchingResponse.ufsUrl,
              imageId: matchingResponse.serverData.imageId,
            }
          }
          return attachment
        })

        if (onUploadComplete) {
          const completedAttachments = uploadedAttachments.filter(
            (a) => !a.isUploading && a.imageId,
          )
          setTimeout(() => {
            onUploadComplete(completedAttachments)

            // Clear attachments after onChange fires
            setAttachments([])
          }, 0) // Ensure this runs after state update
        }

        return uploadedAttachments
      })
    },

    // Handles upload errors
    onUploadError(e) {
      console.log("Upload error:", e)
      // Remove any attachments still marked as uploading
      setAttachments((prev) => prev.filter((a) => !a.isUploading))
      setUploadProgress(undefined)
      setUploadError(handleUploadthingError(e, true))

      // Call onUploadError callback if provided
      onUploadError?.(handleUploadthingError(e, true))
    },
  })

  // Initiates upload after validating file count and current upload state
  function handleStartUpload(files: File[]) {
    const maxAllowedFiles = routeConfig?.image?.maxFileCount ?? 4

    // Calculate total current images: existing form images + attachments not yet in form
    const newAttachmentsCount = attachments.length
    const totalCurrentImages = currentImagesLength + newAttachmentsCount

    const attemptingToUpload = files.length
    const remainingSlots = Math.max(0, maxAllowedFiles - totalCurrentImages)

    if (attemptingToUpload > remainingSlots && totalCurrentImages > 0) {
      toast.error(
        `You can only upload ${remainingSlots} more ${
          remainingSlots === 1 ? "image" : "images"
        }. Or remove existing images to upload more.`,
      )
      return
    }

    if (isUploading) {
      toast.error("Please wait for the current upload to finish.")
      return
    }

    startUpload(files)
  }

  // Removes an attachment by file name and image ID
  function removeAttachment(url: string, imageId: string) {
    startRemoveImageTransition(async () => {
      try {
        await deleteProductImageAction(imageId)
        await axios.delete("/api/uploadthing", {
          data: { url }, // Send image URL to delete from storage
        })

        // Remove the attachment from the state
        setAttachments((prev) =>
          prev.filter((attachment) => attachment.imageId !== imageId),
        )

        toast.success("Image removed successfully")

        onRemoveImageComplete?.(imageId)
      } catch (error) {
        console.log(error)
        toast.error("Failed to remove image")
      }
    })
  }

  return {
    attachments,
    uploadProgress,
    uploadError,
    startUpload: handleStartUpload,
    removeAttachment,
    isUploading,
    maxFiles: routeConfig?.image?.maxFileCount,
    maxSize: routeConfig?.image?.maxFileSize,
  }
}
