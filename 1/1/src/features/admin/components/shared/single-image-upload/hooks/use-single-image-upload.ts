"use client"

import { useState } from "react"

import { useDropzone } from "@uploadthing/react"
import axios from "axios"
import { toast } from "sonner"
import { ClientUploadedFileData } from "uploadthing/types"

import {
  FileRouterInputKey,
  handleUploadthingError,
  useUploadThing,
} from "@/lib/uploadthing"
import { slugify } from "@/lib/utils"

type UseSingleImageUploadOptions = {
  uploadRoute: FileRouterInputKey
  onUploadError?: (error: string) => void
  value?: string | null
  onUploadComplete?: (
    imageId: ClientUploadedFileData<
      | { url: string }
      | { url: string }
      | { url: string }
      | { imageId: string | undefined }
    >[],
  ) => void
}

export const useSingleImageUpload = ({
  uploadRoute,
  onUploadError,
  onUploadComplete,
  value,
}: UseSingleImageUploadOptions) => {
  const [uploadProgress, setUploadProgress] = useState<number>()
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Setup UploadThing
  const { startUpload, isUploading, routeConfig } = useUploadThing(
    uploadRoute,
    {
      // Called before upload begins, allows renaming files
      onBeforeUploadBegin(files) {
        setUploadError(null) // Reset any previous errors
        setUploadProgress(0) // Reset progress for new upload

        // Before upload begins, rename the files for consistency and uniqueness
        const renamedFiles = files.map((file) => {
          const extension = file.name.split(".").pop() ?? "dat" // fallback extension
          const baseName = file.name.replace(/\.[^/.]+$/, "") // remove extension
          const safeName = slugify(baseName) // make name URL-safe
          const newFileName = `${uploadRoute}-${safeName}-${crypto.randomUUID()}.${extension}`

          return new File([file], newFileName, { type: file.type })
        })

        return renamedFiles
      },

      // Called when upload completes successfully
      onClientUploadComplete(res) {
        if (!res?.length) return

        onUploadComplete?.(res)
      },

      // Updates upload progress
      onUploadProgress: setUploadProgress,

      // Handles upload errors
      onUploadError(e) {
        console.log("Upload error:", e)

        setUploadProgress(undefined)
        setUploadError(handleUploadthingError(e))

        // Call onUploadError callback if provided
        onUploadError?.(handleUploadthingError(e))
      },
    },
  )

  const handleStartUpload = async (files: File[]) => {
    if (isUploading) {
      toast.error("Please wait for the current upload to finish.")
      return
    }

    if (value) {
      await axios.delete("/api/uploadthing", {
        data: { url: value },
      })
    }

    startUpload(files)
  }

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleStartUpload(acceptedFiles)
      }
    },
    disabled: isUploading,
  })

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    uploadProgress,
    uploadError,
    isUploading,
    maxSize: routeConfig?.image?.maxFileSize,
  }
}
