import { FC } from "react";

import { ProductsSort } from "@/types";

import { getProductsPublicFilteredPaginated } from "@/data";

import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { ProductCard } from "@/components/shared/product-card";

interface ProductsGridResultProps {
  q?: string;
  categories?: string[];
  attributes?: string[];
  currentPage: number;
  sort?: ProductsSort;
  sale?: string[]; // ✅ Add this line
   unit?: string[];   // ✅ new
  
}

export const ProductsGridResult: FC<ProductsGridResultProps> = async ({
  q,
  categories,
  attributes,
  currentPage,
  sort,
  sale, // ✅ Add this line
   unit,   // ✅ new
   
}) => {
  const { data: products, total } = await getProductsPublicFilteredPaginated(
    q,
    categories,
    attributes,
    sort,
    sale, // ✅ Add this line
    unit,   // ✅ new
    { page: currentPage }
  );

  // Title logic
  let title = "Products";
  if (q && q.trim()) {
    title = `Results for "${q}"`;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No results found"
        description={
          q && q.trim()
            ? `No products match your search for "${q}". Try a different keyword or clear your filters.`
            : "No products found. Try adjusting your filters or search."
        }
      />
    );
  }
  console.log("products after: ",products);

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-center text-2xl font-semibold lg:mb-8 lg:text-3xl">
        {title}
      </h2>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </ul>
      <PaginationBar currentPage={currentPage} totalPages={total || 1} />
    </div>
  );
};
