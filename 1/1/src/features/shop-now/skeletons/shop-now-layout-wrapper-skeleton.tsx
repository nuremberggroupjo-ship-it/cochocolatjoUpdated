import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { ProductsGridSkeleton } from "@/components/shared/skeletons/products-grid-skeleton"

export const ShopNowLayoutWrapperSkeleton: FC = () => {
  return (
    <main className="group my-6 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start">
    
      {/* Sidebar skeleton */}
      <aside className="hidden h-fit lg:sticky lg:top-[70px] lg:block lg:w-64">
        <div className="space-y-6">
          {/* Categories filter skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>
          {/* Dietary filter skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main section skeleton */}
      <section className="w-full max-w-7xl space-y-5">
        {/* Top bar skeleton */}
        <div className="flex w-full items-center">
          {/* Clear All button skeleton */}
          <Skeleton className="hidden h-8 w-28 md:block" />
          <div className="ml-auto flex items-center gap-x-2">
            {/* Mobile filter sheet skeleton (icon) */}
            <Skeleton className="block size-9 rounded-sm lg:hidden" />
            {/* Sort By skeleton */}
            <Skeleton className="h-9 w-42 lg:w-46" />
          </div>
        </div>
        {/* Product grid skeleton */}

        <ProductsGridSkeleton withTitle length={6} className="lg:grid-cols-3" />
      </section>
    </main>
  )
}
