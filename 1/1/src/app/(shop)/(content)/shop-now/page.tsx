import { Metadata } from "next";
import { Suspense } from "react";

import { ProductsSort } from "@/types";
import { toArray } from "@/lib/utils";

import { ProductsGridSkeleton } from "@/components/shared/skeletons/products-grid-skeleton";
import { ProductsGridResult } from "@/features/shop-now/components/products-grid-result";

interface FilterProductsType {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string | string[];
    attribute?: string | string[];
    sort?: string;
    sale?: string | string[];
    unit?: string | string[];
  }>;
}

export default async function ShopNowPage({ searchParams }: FilterProductsType) {
  // ✅ Await the searchParams Promise
  const resolvedParams = await searchParams;

  const { q, attribute, category, page, sort, sale, unit } = resolvedParams;

  const currentPage = Number(page) || 1;
  const categories = toArray(category);
  const attributes = toArray(attribute);
  const sales = toArray(sale);
  const units = toArray(unit);

  return (
    <div className="space-y-10 group-has-[[data-pending]]:animate-pulse">
      <Suspense
        fallback={<ProductsGridSkeleton length={9} withTitle />}
        key={`${q}-${categories?.join(",")}-${attributes?.join(
          ","
        )}-${currentPage}-${sort}-${sales.join(",")}`}
      >
        <ProductsGridResult
          currentPage={currentPage}
          attributes={attributes}
          categories={categories}
          sort={sort as ProductsSort}
          q={q}
          sale={sales} 
          unit={units} 
        />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  // ✅ Await the promise before destructuring
  const resolvedParams = await searchParams;
  const { q } = resolvedParams;

  if (q) {
    const { generateDynamicMetadata, createMetadata } = await import(
      "@/constants"
    );
    return createMetadata(generateDynamicMetadata.searchResults(q));
  }

  const { PAGE_METADATA, createMetadata } = await import("@/constants");
  return createMetadata(PAGE_METADATA.shopNow);
}

