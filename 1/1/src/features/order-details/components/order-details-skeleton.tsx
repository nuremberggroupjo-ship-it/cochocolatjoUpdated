import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading skeleton for order details page
 * Responsive design with proper spacing
 */
export const OrderDetailsSkeleton: FC = () => {
  return (
    <div className="my-4 space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="columns-1 gap-4 space-y-4 lg:columns-2">
        {/* Order Status Tracker */}
        <div className="break-inside-avoid">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="break-inside-avoid">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="break-inside-avoid">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="break-inside-avoid">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}
