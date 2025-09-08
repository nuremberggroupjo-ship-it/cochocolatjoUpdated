import type { ProductsSort } from "@/types"

export const SORT_OPTIONS: { value: ProductsSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "Alphabetical: A-Z" },
  { value: "alpha-desc", label: "Alphabetical: Z-A" },
]
