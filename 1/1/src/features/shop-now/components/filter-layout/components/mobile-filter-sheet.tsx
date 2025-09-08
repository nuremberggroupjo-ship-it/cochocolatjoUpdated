"use client";

import { FC, useState, useTransition } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { AttributeWithProductCount, CategoryWithProductCount } from "@/data";
import { Button } from "@/components/ui/button";
import { AppSheet } from "@/components/shared/app-sheet";
import { GenericCheckboxFilter } from "./generic-checkbox-filter";

interface MobileFilterSheetProps {
  categories: CategoryWithProductCount[];
  attributes: AttributeWithProductCount[];
  optimisticFilters: FiltersType;
  updateFilters?: (updates: Partial<FiltersType>) => void;
  lockedSlugs?: string[];
}

type FiltersType = {
  category: string[];
  attribute: string[];
  sort: string;
  sale: string[];
  unit: string[];
};

export const MobileFilterSheet: FC<MobileFilterSheetProps> = ({
  categories,
  attributes,
  optimisticFilters,
  updateFilters,
  lockedSlugs = [],
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);
  console.log(isPending);

  // Robust apply: call parent updateFilters if available, otherwise push URL ourselves
  const applyFilters = (updates: Partial<FiltersType>) => {
    console.log(
      "MobileFilterSheet: applyFilters called:",
      updates,
      "have updateFilters?",
      typeof updateFilters
    );

    if (typeof updateFilters === "function") {
      // Preferred: let parent handle optimistic state + router.push
      try {
        updateFilters(updates);
      } catch (err) {
        console.error("MobileFilterSheet: updateFilters threw:", err);
      }
      return;
    }

    const newState: FiltersType = {
      ...optimisticFilters,
      ...updates,
    };

    // ensure locked slugs remain present in category
    newState.category = Array.from(new Set([...(newState.category ?? []), ...lockedSlugs]));

    // Build new URLSearchParams from the current query string (safe)
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined && v !== null && String(v) !== "") newSearchParams.append(key, v);
        });
      } else if (value !== undefined && value !== null && String(value) !== "") {
        newSearchParams.set(key, String(value));
      }
    });

    // drop page when filters change
    newSearchParams.delete("page");

    const qs = newSearchParams.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    startTransition(() => {
      console.log("MobileFilterSheet: fallback push ->", url);
      router.push(url);
    });
  };

  const saleOptions = [{ id: "1", name: "On Sale", slug: "sale", count: 0 }];

  return (
    <AppSheet
      trigger={
        <Button size="icon" onClick={handleOpenSheet} className="ml-auto flex lg:hidden" variant="outline">
          <SlidersHorizontalIcon />
        </Button>
      }
      title="Filters"
      description="Select categories and dietary preferences to refine your search."
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
    >
      <section className="px-4">
        <GenericCheckboxFilter
          title="categories"
          items={categories.map((category) => ({
            slug: category.slug,
            name: category.name,
            id: category.id,
            count: category._count?.products ?? 0,
          }))}
          selectedSlugs={optimisticFilters.category}
          lockedSlugs={lockedSlugs}
          onSelectionChange={(categoriesSlugs) => {
            applyFilters({ category: categoriesSlugs });
            handleCloseSheet();
          }}
        />

        <GenericCheckboxFilter
          title="dietary"
          items={attributes.map((attribute) => ({
            slug: attribute.slug,
            name: attribute.name,
            id: attribute.id,
            count: attribute._count?.products ?? 0,
          }))}
          selectedSlugs={optimisticFilters.attribute}
          onSelectionChange={(attributesSlugs) => {
            applyFilters({ attribute: attributesSlugs });
            handleCloseSheet();
          }}
        />

        <GenericCheckboxFilter
          title="sale"
          items={saleOptions}
          selectedSlugs={optimisticFilters.sale}
          onSelectionChange={(saleSlugs) => {
            applyFilters({ sale: saleSlugs });
            handleCloseSheet();
          }}
        />

        <GenericCheckboxFilter
          title="size"
          items={[
            { id: "unit-g", slug: "g", name: "g".toLowerCase(), count: 0 },
            { id: "unit-kg", slug: "kg", name: "kg".toLowerCase(), count: 0 },
            { id: "unit-ml", slug: "ml", name: "ml".toLowerCase(), count: 0 },
          ]}
          selectedSlugs={optimisticFilters.unit}
          onSelectionChange={(unitSlugs) => {
            applyFilters({ unit: unitSlugs });
            handleCloseSheet();
          }}
        />
      </section>
    </AppSheet>
  );
};
