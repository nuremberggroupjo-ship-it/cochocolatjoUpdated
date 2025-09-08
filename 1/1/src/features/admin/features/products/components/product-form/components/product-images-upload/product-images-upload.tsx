import Image from "next/image"
import { FC, TransitionStartFunction } from "react"

import { useDropzone } from "@uploadthing/react"
import { UploadCloudIcon, XIcon } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { SaveProductSchema } from "@/features/admin/features/products/lib/product.schema"

import { useProductImageUpload } from "./hooks"

interface ProductImagesUploadProps
  extends ControllerRenderProps<SaveProductSchema, "images"> {
  hasError?: boolean
  isRemoveImagePending: boolean
  startRemoveImageTransition: TransitionStartFunction
}

export const ProductImagesUpload: FC<ProductImagesUploadProps> = ({
  hasError,
  onChange,
  isRemoveImagePending,
  startRemoveImageTransition,
  value,
}) => {
  const {
    startUpload,
    isUploading,
    attachments, // new uploads
    uploadError,
    uploadProgress,
    removeAttachment,
    maxFiles,
    maxSize,
  } = useProductImageUpload({
    startRemoveImageTransition,
    currentImagesLength: value.length || 0,
    onUploadComplete: (attachments) => {
      // FIX: Append new images to existing value instead of replacing
      const newImages = attachments.map((attachment) => ({
        id: attachment.imageId!,
        url: attachment.url!,
      }))

      // Get current value and ensure it's an array
      const currentImages = Array.isArray(value) ? value : []

      // Filter out duplicates based on image ID
      const filteredNewImages = newImages.filter(
        (newImage) =>
          !currentImages.some(
            (currentImage) => currentImage.id === newImage.id,
          ),
      )

      // Only append non-duplicate images
      if (filteredNewImages.length > 0) {
        onChange([...currentImages, ...filteredNewImages])
      }
    },
    onUploadError: (error) => {
      toast.error(error)
    },
    onRemoveImageComplete: (removedImageId) => {
      // Remove the image from form value by ID
      // This works for both newly uploaded images and existing images
      const currentImages = Array.isArray(value) ? value : []
      const updatedImages = currentImages.filter(
        (image) => image.id !== removedImageId,
      )
      onChange(updatedImages)
    },
  })

  const isLoading = isUploading
  const isDisabled =
    isLoading ||
    // attachments.filter(
    //   (attachment) => !value.some((v) => v.id === attachment.imageId),
    // ).length >= (maxFiles || 4)
    attachments.length >= (maxFiles || 4) ||
    value.length >= (maxFiles || 4)

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles)
      }
    },
    disabled: isDisabled,
  })

  return (
    <div className="w-full space-y-2">
      {/* dropzone */}
      <div
        className={cn(
          "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors duration-200",
          "active:border-primary",
          isDisabled
            ? "bg-muted cursor-not-allowed opacity-50"
            : "hover:bg-sidebar",
          hasError ? "border-destructive" : "border-border/50",
          isDragActive ? "border-primary bg-primary/5" : "border-border",
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloudIcon className="size-7 md:size-9" />
          <div className="text-xs font-medium sm:text-sm">
            {isDragActive
              ? "Drop images here..."
              : "Drag & drop images here, or click to select"}
          </div>
          <div className="hidden text-xs sm:block">
            {maxFiles && `You can upload up to ${maxFiles} images.`}
            {maxSize && `, max size: ${maxSize}`}
          </div>
          {isLoading && (
            <div className="mt-2 flex items-center">
              <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span className="ml-2 text-xs">Uploading {uploadProgress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="text-destructive flex items-center gap-1 text-sm">
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image previews */}
      {value.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-md border"
            >
              {image.url && (
                <>
                  <Image
                    src={image.url as string}
                    alt={`Preview ${index + 1}`}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                    priority
                  />

                  {removeAttachment && (
                    <div className="absolute top-0 right-0 flex items-center justify-center">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        disabled={isRemoveImagePending}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAttachment(
                            image.url as string,
                            image.id as string,
                          )
                        }}
                      >
                        <XIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
