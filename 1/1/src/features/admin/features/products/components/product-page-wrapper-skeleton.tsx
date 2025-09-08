import { FC } from "react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const ProductPageWrapperSkeleton: FC = () => {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Delete button placeholder (for editing state) */}
        <Skeleton className="h-10 w-20" />
      </div>

      <Separator />

      {/* Form */}
      <div className="mb-12 max-w-full space-y-8">
        <div className="grid grid-cols-1 items-start gap-6 text-base md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" /> {/* FormMessage space */}
          </div>

          

          {/* Slug */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-x-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* isDiscountActive Checkbox */}
          <div className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-sm" />
            <div className="space-y-1 leading-none">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          {/* Discount Price (conditional - showing skeleton for it) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Hidden spacer div - lg:col-span-1 lg:block */}
          <div className="hidden lg:col-span-1 lg:block"></div>

          {/* Short Description */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-x-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Description - col-span-1 md:col-span-2 */}
          <div className="col-span-1 space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Images - col-span-1 md:col-span-2 */}
          <div className="col-span-1 space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-16" />
            <div className="border-border/50 rounded-lg border-2 border-dashed p-8">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2 text-center">
                  <Skeleton className="mx-auto h-4 w-32" />
                  <Skeleton className="mx-auto h-3 w-48" />
                </div>
              </div>
            </div>
            <Skeleton className="h-3 w-0" />
          </div>

          {/* Hidden spacer div - lg:col-span-1 lg:block */}
          <div className="hidden lg:col-span-1 lg:block"></div>

          {/* Featured Status Checkbox */}
          <div className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-sm" />
            <div className="space-y-1 leading-none">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-sm" />
            <div className="space-y-1 leading-none">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-72" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </>
  )
}
