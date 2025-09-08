import type { Metadata } from "next"
import { Suspense } from "react"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { CategoriesSkeleton } from "@/components/shared/skeletons/categories-skeleton"

import {
  AboutUsSection,
  CategoriesSection,
  FeaturedProductsSectionWrapper,
  HeroSectionWrapper,
} from "@/features/home/sections"
import {
  FeaturedProductsSkeleton,
  HeroSectionSkeleton,
} from "@/features/home/skeletons"

export const metadata: Metadata = createMetadata(PAGE_METADATA.home)

export default function HomePage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSectionWrapper />
      </Suspense>
      <div className="container">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection />
        </Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsSectionWrapper />
        </Suspense>
        <AboutUsSection />
      </div>
    </main>
  )
}
