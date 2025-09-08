import { FC } from "react"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardSkeletonProps {
  className?: string
}

export const ProductCardSkeleton: FC<ProductCardSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "border-border/50 basis-1/1 items-center overflow-hidden rounded-xl border md:basis-1/2 lg:basis-1/4",
        className,
      )}
    >
      {/* Product image skeleton */}
      <Skeleton className="h-48 w-full rounded-none sm:h-56 md:h-64" />

      {/* Product details */}
      <div className="space-y-3 p-4">
        {/* Product price */}
        <div className="flex items-center justify-between gap-2">
          {/* Product name */}
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Product description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Product actions */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Separator className="bg-border/50" />
      <div className="flex flex-wrap items-center justify-center gap-2 p-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={index}
            className="relative size-8 overflow-hidden rounded-full sm:size-6 md:size-8"
          />
        ))}
      </div>
    </div>
  )
}
