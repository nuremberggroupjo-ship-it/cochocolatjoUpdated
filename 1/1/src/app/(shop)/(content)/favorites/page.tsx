import { type Metadata } from "next"
import { Suspense } from "react"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { ProductsGridSkeleton } from "@/components/shared/skeletons/products-grid-skeleton"

import { FavoritesPageWrapper } from "@/features/favorites/components/favorites-page-wrapper"

export const metadata: Metadata = createMetadata(PAGE_METADATA.favorites)

interface CategoryPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function FavoritesPage(props: CategoryPageProps) {
  const { page } = await props.searchParams
  const currentPage = Number(page) || 1

  return (
    <Suspense fallback={<ProductsGridSkeleton />} key={currentPage}>
      <FavoritesPageWrapper currentPage={currentPage} />
    </Suspense>
  )
}
