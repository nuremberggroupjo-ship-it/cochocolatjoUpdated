// app/(shop)/(content)/categories/[slug]/Categories.tsx

import { Suspense } from "react";

import {
  getAttributesPublicWithProductCount,
  getCategoriesPublicWithProductCount,
} from "@/data";

import { ProductsSort } from "@/types";
import { toArray } from "@/lib/utils";

import { ProductsGridSkeleton } from "@/components/shared/skeletons/products-grid-skeleton";
import { FiltersLayout } from "../../../../../features/shop-now/components/filter-layout/filters-layout";

import { ProductsGridResult } from "@/features/shop-now/components/products-grid-result";

interface CategoriesProps {
  slug: string | string[];
  searchParams: {
    q?: string;
    page?: string;
    category?: string | string[];
    attribute?: string | string[];
    sort?: string;
    sale?: string | string[];
    unit?: string | string[];
  };
}

export default async function Categories({ slug, searchParams }: CategoriesProps) {
  console.log("Slug from URL:", slug);

  const { q, attribute, page, sort, sale, unit } = searchParams;
  const currentPage = Number(page) || 1;
  const attributes = toArray(attribute);
  const sales = toArray(sale);
  const units = toArray(unit);

  // Fetch category & attribute lists for filter sidebar
  const [categories2, attributes2] = await Promise.all([
    getCategoriesPublicWithProductCount(),
    getAttributesPublicWithProductCount(),
  ]);

  // find the category object that matches the slug (if you need it)
  const activeCategory = categories2.find((c) => c.slug === (Array.isArray(slug) ? slug[0] : slug));

  // Use the route slug (page category) to scope server fetch — pass as array
  const pageCategories = Array.isArray(slug) ? slug : slug ? [slug] : [];

  return (
    <FiltersLayout
      categories={activeCategory ? [activeCategory] : []}
      attributes={attributes2}
      lockedSlugs={activeCategory ? [activeCategory.slug] : []}
    >
      <div className="space-y-10 group-has-[[data-pending]]:animate-pulse">
        <Suspense
          fallback={<ProductsGridSkeleton length={8} withTitle />}
          key={`${slug}-${q}-${pageCategories.join(",")}-${attributes?.join(",")}-${currentPage}-${sort}-${sales.join(",")}`}
        >
          <ProductsGridResult
            currentPage={currentPage}
            attributes={attributes}
            categories={pageCategories}
            sort={sort as ProductsSort}
            q={q}
            sale={sales}
            unit={units}
          />
        </Suspense>
      </div>
    </FiltersLayout>
  );
}
