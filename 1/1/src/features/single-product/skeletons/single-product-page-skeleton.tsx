import { FC } from "react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const SingleProductPageSkeleton: FC = () => {
  return (
    <section className="mx-auto py-4 lg:container lg:px-0 lg:py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
        {/* Image carousel skeleton */}
        <ProductPreviewImagesSkeleton />

        {/* Product details skeleton */}
        <ProductDetailsSkeleton />
      </div>

      <Separator className="bg-border/50 my-8" />

      <div className="flex w-full flex-col space-y-4 lg:space-y-6">
        {/* Attributes skeleton */}
        <AttributesTableSkeleton />

        {/* Rich text content skeleton */}
        <RichTextDisplaySkeleton />
      </div>
    </section>
  )
}

// Product Preview Images Skeleton
const ProductPreviewImagesSkeleton: FC = () => {
  return (
    <div className="w-full md:col-span-2">
      {/* Desktop Layout with thumbnails */}
      <div className="hidden lg:flex lg:gap-4">
        {/* Vertical Thumbnail Skeleton */}
        <div className="w-20 flex-shrink-0">
          <div className="flex max-h-96 flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-square w-full rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Main Image Skeleton */}
        <div className="flex-1">
          <Skeleton className="aspect-[10/11] w-full rounded-xl" />
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <Skeleton className="aspect-square w-full rounded-xl" />

        {/* Horizontal Thumbnails */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="mx-auto w-full max-w-xs sm:max-w-sm">
          <Skeleton className="aspect-square w-full rounded-xl" />
        </div>

        {/* Mobile Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-2.5 w-2.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Product Details Skeleton
const ProductDetailsSkeleton: FC = () => {
  return (
    <div className="flex w-full flex-col space-y-4 md:col-span-3 lg:space-y-6">
      {/* Category */}
      <Skeleton className="h-4 w-24" />

      {/* Product name */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full sm:h-9 md:h-10 lg:h-12" />
        <Skeleton className="h-8 w-3/4 sm:h-9 md:h-10 lg:h-12" />
      </div>

      {/* Short description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Price and stock */}
      <div className="flex flex-row items-center gap-4">
        <Skeleton className="h-8 w-20 sm:h-9 sm:w-24 md:h-10 md:w-28" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full gap-3 pt-4 sm:max-w-md">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  )
}

// Attributes Table Skeleton
const AttributesTableSkeleton: FC = () => {
  return (
    <section className="space-y-4">
      <Skeleton className="h-7 w-32" />

      <div className="bg-background border-border/50 w-full overflow-hidden rounded-lg border">
        <ul className="divide-border/50 divide-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className={`grid min-h-[70px] grid-cols-[auto_1fr] items-center gap-3 p-3 ${
                index % 2 === 0 ? "bg-background" : "bg-muted/30"
              }`}
            >
              {/* Image skeleton */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <Skeleton className="h-12 w-12 rounded" />
              </div>

              {/* Content skeleton */}
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Rich Text Display Skeleton
const RichTextDisplaySkeleton: FC = () => {
  return (
    <section className="space-y-4">
      <Skeleton className="h-7 w-40" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-4 ${
              index === 2 ? "w-3/4" : index === 5 ? "w-5/6" : "w-full"
            }`}
          />
        ))}
      </div>

      {/* Simulate a paragraph break */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-4 ${index === 3 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </section>
  )
}
