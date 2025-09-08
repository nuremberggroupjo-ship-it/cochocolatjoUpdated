import { FC } from "react"

import { getFavoriteProductsPaginated } from "@/data"

import { EmptyState } from "@/components/shared/empty-state"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { ProductCard } from "@/components/shared/product-card"

interface FavoritesPageWrapperProps {
  currentPage: number
}

export const FavoritesPageWrapper: FC<FavoritesPageWrapperProps> = async ({
  currentPage,
}) => {
  const { data: products, total } = await getFavoriteProductsPaginated({
    page: currentPage,
  })

  // No favorites at all
  if (total === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Start adding products to your favorites to see them here!"
        linkText="← Browse products"
        linkHref="/shop-now"
      />
    )
  }

  // Page out of range
  if (currentPage > (total || 1)) {
    return (
      <EmptyState
        title="Page not found"
        description={`This page doesn't exist. You have ${total} page${total === 1 ? "" : "s"} of favorites.`}
        linkText="← First page"
        linkHref="/favorites"
      />
    )
  }

  return (
    <div className="my-4 space-y-8">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} baseHref="/favorites" />
        ))}
      </ul>
      {total && total > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={total} // This is already calculated as totalPages
        />
      )}
    </div>
  )
}
