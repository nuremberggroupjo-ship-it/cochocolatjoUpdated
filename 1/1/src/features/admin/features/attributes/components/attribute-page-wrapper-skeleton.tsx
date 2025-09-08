import { FC } from "react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const AttributePageWrapperSkeleton: FC = () => {
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Delete button placeholder (for editing state) */}
        <Skeleton className="h-10 w-20" />
      </div>

      <Separator className="bg-border/50" />

      {/* Form fields */}
      <div className="mb-12 max-w-3xl space-y-6">
        {/* Name & Slug row */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Image upload area */}
          <div className="border-border/50 rounded-lg border-2 border-dashed p-8">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-4 w-32" />
                <Skeleton className="mx-auto h-3 w-48" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
