"use client"

import Image from "next/image"
import { TransitionStartFunction } from "react"

import axios from "axios"
import { UploadCloudIcon, XIcon } from "lucide-react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { toast } from "sonner"

import { FileRouterInputKey } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { useSingleImageUpload } from "./hooks"

interface SingleImageUploadProps<T extends FieldValues> {
  hasError?: boolean
  field: ControllerRenderProps<T>
  uploadRoute: FileRouterInputKey
  isDeleteImagePending?: boolean
  startDeleteImageTransition: TransitionStartFunction
}

export const SingleImageUpload = <T extends FieldValues>({
  field,
  hasError,
  uploadRoute,
  isDeleteImagePending,
  startDeleteImageTransition,
}: SingleImageUploadProps<T>) => {
  const { onChange, value } = field
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    uploadError,
    uploadProgress,
    maxSize,
    isUploading,
  } = useSingleImageUpload({
    uploadRoute,
    value,
    onUploadComplete: (res) => {
      // Update the field value with the uploaded image URL
      onChange(res[0]?.ufsUrl)
    },
  })

  const isLoading = isUploading || isDeleteImagePending

  // Handle image deletion
  const handleDeleteImage = () => {
    startDeleteImageTransition(async () => {
      try {
        await axios.delete("/api/uploadthing", {
          data: { url: value },
        })
        onChange("")
        toast.success("Image removed successfully")
      } catch (error) {
        console.error(error)
        toast.error("Failed to remove image")
      }
    })
  }

  return (
    <div className="w-full space-y-2">
      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-md border",
            "group hover:ring-primary/50 hover:ring-1",
            isLoading && "opacity-70",
          )}
        >
          {/* Delete button */}
          <Button
            type="button"
            disabled={isLoading}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 size-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleDeleteImage}
          >
            <XIcon className="size-4" />
          </Button>

          {/* Image */}
          <div className="relative h-60 w-full">
            <Image
              src={field.value}
              alt={`preview ${uploadRoute} image`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>

          {/* Replacement upload overlay */}
          <div
            className={cn(
              "absolute inset-0 z-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
              isDragActive ? "border-primary bg-primary/5" : "border-border",
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <UploadCloudIcon className="text-primary-foreground mb-2 size-6" />
            <p className="text-primary-foreground text-center text-sm">
              Click to replace image
            </p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors duration-200",
            "active:border-primary",
            // Base border and background
            "border-border/50",
            // Error state (highest priority)
            hasError && "border-destructive",
            // Drag active state (medium priority) - only if no error
            isDragActive && !hasError && "border-primary bg-primary/5",
            isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-muted/50",
            // Active state - only if not disabled and no error
            !isLoading && !hasError && "active:border-primary",
          )}
        >
          <input {...getInputProps()} />

          {/* Dropzone content */}
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-center">
            <UploadCloudIcon className="size-7 md:size-9" />
            <div className="text-xs font-medium sm:text-sm">
              {isDragActive
                ? "Drop the image here..."
                : "Drag and drop or click to upload"}
            </div>
            <div className="hidden text-xs sm:flex sm:flex-col">
              <span>Only one image allowed</span>
              <span> Max file size: {maxSize}</span>
            </div>

            {isLoading && (
              <div className="mt-2 flex items-center">
                <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span className="ml-2 text-xs">
                  Uploading {uploadProgress}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="text-destructive flex items-center gap-1 text-sm">
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  )
}
