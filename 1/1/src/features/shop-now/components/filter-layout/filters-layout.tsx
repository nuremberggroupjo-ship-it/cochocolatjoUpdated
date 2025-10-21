"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FC, useOptimistic, useTransition } from "react";

import type { ProductsSort } from "@/types";

import type {
  AttributeWithProductCount,
  CategoryWithProductCount,
} from "@/data";

import {
  ClearAllFiltersButton,
  GenericCheckboxFilter,
  MobileFilterSheet,
  SortByFilter,
} from "./components";

interface FiltersLayoutProps {
  children: React.ReactNode;
  categories: CategoryWithProductCount[];
  attributes: AttributeWithProductCount[];
  /**
   * Slugs that should be locked (always checked and cannot be unchecked).
   * Example: ['two'] to lock category with slug 'two'.
   */
  lockedSlugs?: string[];
}

export const FiltersLayout: FC<FiltersLayoutProps> = ({
  children,
  categories,
  attributes,
  lockedSlugs = [],
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const q = searchParams.get("q") || "";

  // Ensure initial category array includes any locked slugs
  const initialCategory = Array.from(
    new Set([...searchParams.getAll("category"), ...lockedSlugs])
  );

  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    category: initialCategory,
    attribute: searchParams.getAll("attribute"),
    sale: searchParams.getAll("sale"),
    unit: searchParams.getAll("unit"),
    sort: (searchParams.get("sort") as ProductsSort) || "newest",
  });

  // Helper to ensure locked slugs are present in category array
  const ensureLockedInCategory = (stateCategory: string[] = []) =>
    Array.from(new Set([...(stateCategory ?? []), ...lockedSlugs]));

  // Generic update function
  const updateFilters = (updates: Partial<typeof optimisticFilters>) => {
    const newState = { ...optimisticFilters, ...updates };

    // ensure locked slugs remain in category
    newState.category = ensureLockedInCategory(newState.category);

    // Build new search params from current URL
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => {
          newSearchParams.append(key, v);
        });
      } else if (value !== undefined && value !== null) {
        newSearchParams.set(key, value as string);
      }
    });

    newSearchParams.delete("page");

    const url = newSearchParams.toString()
      ? `${pathname}?${newSearchParams.toString()}`
      : pathname;

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(url);
    });
  };

  // Clear all filters but preserve locked slugs
  const clearFilters = () => {
    const params = new URLSearchParams();

    // keep locked categories in the query
    ensureLockedInCategory([]).forEach((c) => params.append("category", c));

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      setOptimisticFilters({
        category: ensureLockedInCategory([]),
        attribute: [],
        sale: [],
        unit: [],
        sort: "newest",
      });

      router.push(url);
    });
  };

  const hasActiveFilters =
    (optimisticFilters.category?.length ?? 0) > 0 ||
    (optimisticFilters.attribute?.length ?? 0) > 0 ||
    (optimisticFilters.unit?.length ?? 0) > 0 ||
    !!q;

  return (
    <main className="group my-6 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start">
      <aside
        className="hidden h-fit lg:sticky lg:top-[70px] lg:block lg:w-64"
        data-pending={isPending ? "" : undefined}
      >
        <GenericCheckboxFilter
          title="categories"
          items={categories.map((category) => ({
            slug: category.slug,
            name: category.name,
            id: category.id,
            count: category._count.products,
          }))}
          selectedSlugs={optimisticFilters.category}
          onSelectionChange={(categoriesSlugs) =>
            updateFilters({ category: categoriesSlugs })
          }
          // pass locked slugs so the component can render them disabled
          // GenericCheckboxFilter should support a `lockedSlugs` prop
          // (if not present, add it as previously discussed)

          lockedSlugs={lockedSlugs}
        />

        <GenericCheckboxFilter
          title="dietary"
          items={attributes.map((attribute) => ({
            slug: attribute.slug,
            name: attribute.name,
            id: attribute.id,
            count: attribute._count.products,
          }))}
          selectedSlugs={optimisticFilters.attribute}
          onSelectionChange={(attributesSlugs) =>
            updateFilters({ attribute: attributesSlugs })
          }
        />

        <GenericCheckboxFilter
          title="sale"
          items={[
            {
              id: "sale",
              slug: "sale",
              name: "On Sale",
              count: 0,
            },
          ]}
          selectedSlugs={optimisticFilters.sale || []}
          onSelectionChange={(saleSlugs) => updateFilters({ sale: saleSlugs })}
        />

        <GenericCheckboxFilter
          title="size"
          items={[
            { id: "unit-g", slug: "g", name: "g".toLowerCase(), count: 0 },
           
            { id: "unit-ml", slug: "ml", name: "ml".toLowerCase(), count: 0 },
          ]}
          selectedSlugs={optimisticFilters.unit ?? []}
          onSelectionChange={(unitSlugs) => updateFilters({ unit: unitSlugs })}
        />
      </aside>

      <section className="w-full max-w-7xl space-y-5">
        <div className="flex items-center">
          <ClearAllFiltersButton
            onClear={clearFilters}
            disabled={isPending}
            show={hasActiveFilters}
          />
          <div className="ml-auto flex items-center justify-between gap-x-2">
            <MobileFilterSheet
              categories={categories}
              attributes={attributes}
              optimisticFilters={optimisticFilters}
              
              // also pass locked slugs to mobile sheet so it can render disabled items
            
              lockedSlugs={lockedSlugs}
            />
            <SortByFilter
              sort={optimisticFilters.sort as ProductsSort}
              updateSort={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>

        {children}
      </section>
    </main>
  );
};
