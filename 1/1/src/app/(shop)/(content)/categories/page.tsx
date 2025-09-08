import { type Metadata } from "next"
import { Suspense } from "react"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { CategoriesSkeleton } from "@/components/shared/skeletons/categories-skeleton"

import { CategoriesPageWrapper } from "@/features/categories/components/categories-page-wrapper"

export const metadata: Metadata = createMetadata(PAGE_METADATA.categories)

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <CategoriesSkeleton withoutTitle className="mt-4! mb-6 lg:max-w-full" />
      }
    >
      
      <CategoriesPageWrapper />
    </Suspense>
  )
}
