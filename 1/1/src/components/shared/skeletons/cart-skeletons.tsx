import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { PaginationSkeleton } from "@/components/shared/skeletons/pagination-skeleton"

export const CartItemSkeleton: FC = () => {
  return (
    <div className="group border-border/60 bg-card relative overflow-hidden rounded-xl border p-3 sm:p-4 md:p-3 lg:p-4">
      {/* Mobile Layout */}
      <div className="flex gap-3 sm:gap-4 md:hidden">
        {/* Product Image - Mobile */}
        <div className="flex-shrink-0">
          <Skeleton className="h-16 w-16 rounded-lg sm:h-20 sm:w-20" />
        </div>

        {/* Content - Mobile */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4 sm:h-5" />
            </div>

            {/* Price - Mobile */}
            <div className="flex flex-col items-end space-y-1">
              <Skeleton className="h-4 w-16 sm:h-5" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Unit Price */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
            </div>

            {/* Quantity Controls - Mobile */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden gap-3 md:flex lg:gap-4">
        {/* Product Image - Desktop */}
        <div className="flex-shrink-0">
          <Skeleton className="h-18 w-18 rounded-lg lg:h-20 lg:w-20" />
        </div>

        {/* Product Info - Desktop */}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 lg:h-6" />

          {/* Description lines */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Badge Row */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Quantity Controls - Desktop */}
        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-12 lg:w-16" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>

        {/* Price Section - Desktop */}
        <div className="flex min-w-0 flex-col items-end justify-center space-y-1">
          <Skeleton className="h-5 w-20 lg:h-6 lg:w-24" />
          <Skeleton className="h-4 w-16 lg:h-4" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

export const CartSummarySkeleton: FC = () => {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <Skeleton className="h-6 w-32" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <hr />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export const CartPageSkeleton: FC = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-8 w-48" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  )
}

export const CartItemsListSkeleton: FC<{ length?: number }> = ({
  length = 3,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Array.from({ length }).map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>

      {/* Pagination Skeleton */}

      <PaginationSkeleton />
    </div>
  )
}
