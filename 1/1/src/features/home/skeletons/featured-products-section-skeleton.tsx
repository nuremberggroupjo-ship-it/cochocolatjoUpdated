import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { ProductCardSkeleton } from "@/components/shared/skeletons/product-card-skeleton"

import { SectionWrapper } from "@/features/home/components/section-wrapper"

export const FeaturedProductsSkeleton: FC = () => (
  <SectionWrapper title="Featured Products" id="featured-products">
    <div className="mx-auto md:max-w-[90%]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <ul className="mx-auto mt-4 flex gap-4 md:mt-6 md:gap-6 lg:mt-8 lg:gap-4">
        {/* Always show 4, but hide extra ones with CSS */}
        <ProductCardSkeleton />

        <ProductCardSkeleton className="hidden sm:block" />

        <ProductCardSkeleton className="hidden md:block" />

        <ProductCardSkeleton className="hidden lg:block" />
      </ul>
    </div>
  </SectionWrapper>
)
