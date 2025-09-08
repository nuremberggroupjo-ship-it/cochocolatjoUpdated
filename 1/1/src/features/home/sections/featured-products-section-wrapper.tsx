import { FC } from "react"

import { getFeaturedProducts } from "@/data"

import { FeaturedProductsSection } from "./featured-products-section"

export const FeaturedProductsSectionWrapper: FC = async () => {
  // Fetch active featured products from database
  const featuredProducts = await getFeaturedProducts()

  if (!featuredProducts || featuredProducts.length === 0) {
    // Return fallback or null if no featured products
    return null
  }

  return <FeaturedProductsSection featuredProducts={featuredProducts} />
}
