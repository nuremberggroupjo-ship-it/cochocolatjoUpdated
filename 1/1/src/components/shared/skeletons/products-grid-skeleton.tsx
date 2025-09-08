import { FC } from "react"

import { cn } from "@/lib/utils"

import { Skeleton } from "@/components/ui/skeleton"

import { PaginationSkeleton } from "@/components/shared/skeletons/pagination-skeleton"
import { ProductCardSkeleton } from "@/components/shared/skeletons/product-card-skeleton"

interface ProductsGridSkeletonProps {
  length?: number
  className?: string
  withTitle?: boolean
}

export const ProductsGridSkeleton: FC<ProductsGridSkeletonProps> = ({
  length = 4,
  withTitle = false,
  className,
}) => {
  return (
    <section className="my-4 space-y-8">
      {withTitle && (
        <div className="flex w-full items-center justify-center">
          <Skeleton className="mb-0 h-8 w-40 md:h-10 md:w-48" />
        </div>
      )}
      <ul
        className={cn(
          "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </ul>
      <PaginationSkeleton />
    </section>
  )
}
