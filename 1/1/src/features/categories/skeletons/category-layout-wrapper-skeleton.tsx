import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { ProductsGridSkeleton } from "@/components/shared/skeletons/products-grid-skeleton"

export const CategoryLayoutWrapperSkeleton: FC = () => {
  return (
    <section className="mt-4">
      <div className="space-y-4">
        {/* Cover image skeleton */}
        <Skeleton className="aspect-[16/5.5] w-full rounded" />

        {/* Category name skeleton */}
        <Skeleton className="h-6 w-64 sm:h-4 md:h-5 lg:h-6" />

        {/* Category description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Products grid skeleton */}

      <div className="mt-8 space-y-5">
        <h2 className="font-bold tracking-wider sm:text-base md:text-xl lg:text-2xl">
          Products
        </h2>
        <ProductsGridSkeleton />
      </div>
    </section>
  )
}
