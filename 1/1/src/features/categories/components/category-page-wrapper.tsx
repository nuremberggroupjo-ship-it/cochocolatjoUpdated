
import { FC } from "react"

import { getProductsPublicByCategoryPaginated } from "@/data"
import {FiltersLayout} from "../../../features/shop-now/components/filter-layout/filters-layout"
import {
  getAttributesPublicWithProductCount,
  getCategoriesPublicWithProductCount,
} from "@/data"
import { EmptyState } from "@/components/shared/empty-state"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { ProductCard } from "@/components/shared/product-card"

interface CategoryPageWrapperProps {
  slug: string
  currentPage: number
}

export const CategoryPageWrapper: FC<CategoryPageWrapperProps> = async ({
  slug,
  currentPage,
}) => {
  const { data: products, total } = await getProductsPublicByCategoryPaginated(
    slug,
    { page: currentPage },
  )

  // No products in this category
  if (total === 0) {
    return (
      <EmptyState
        title="No products found"
        description="This category doesn't have any products yet. Check back soon or explore other categories!"
        linkText="← Browse categories"
        linkHref="/categories"
      />
    )
  }

  

  // Page out of range
  if (currentPage > (total || 1)) {
    return (
      <EmptyState
        title="Page not found"
        description={`This page doesn't exist. There ${total === 1 ? "is only" : "are only"} ${total} page${total === 1 ? "" : "s"} in this category.`}
        linkText="← First page"
        linkHref={`/categories/${slug}`}
      />
    )
  }
 const [categories, attributes] = await Promise.all([
    getCategoriesPublicWithProductCount(),
    getAttributesPublicWithProductCount(),
  ])

  if (!categories) {
    return null
  }
  
  return (
<FiltersLayout categories={categories} attributes={attributes}>
  <div className="my-4 space-y-8">
      <h1>test gggdkgakwgdkgdgkawhgdhwaghkjhlb</h1>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </ul>
      <PaginationBar currentPage={currentPage} totalPages={total || 1} />
    </div>
</FiltersLayout>
    
  )
}