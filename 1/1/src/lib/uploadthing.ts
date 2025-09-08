import type { OurFileRouter } from "@/app/api/uploadthing/core"
import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"
import { Json } from "@uploadthing/shared"
import { UploadThingError } from "uploadthing/server"

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

// Create type for the keys of our file router
export type FileRouterInputKey = keyof OurFileRouter

export const handleUploadthingError = (
  error: UploadThingError<Json>,
  multiple: boolean = false,
) => {
  const message = error.message

  const errorMessages: Record<string, string> = {
    FileSizeMismatch:
      "File size exceeds the limit. Please upload a smaller image.",
    InvalidFileType: "Invalid image type. Please upload a valid image.",
    FileCountMismatch: multiple
      ? "File count exceeds the limit. Please upload up to 4 images."
      : "You can only upload 1 image.",
    Unauthorized: "You are not authorized to perform this action.",
  }

  for (const [errorType, errorMessage] of Object.entries(errorMessages)) {
    if (message.includes(errorType)) {
      return errorMessage
    }
  }

  return "An unexpected error occurred during the upload. Please try again."
}
