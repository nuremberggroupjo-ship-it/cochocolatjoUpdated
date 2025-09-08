import { Metadata } from "next";
import { Suspense } from "react";

import { type WithRequiredParams } from "@/types";

import { getCategoriesAdmin, getCategoryBySlugAdmin } from "@/data";

import { CategoryPageWrapper } from "@/features/admin/features/categories/components/category-page-wrapper";
import { CategoryPageWrapperSkeleton } from "@/features/admin/features/categories/components/category-page-wrapper-skeleton";

export default function CategoryPage({ params }: WithRequiredParams) {
  return (
    <Suspense fallback={<CategoryPageWrapperSkeleton />}>
      <CategoryPageWrapper params={params} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: WithRequiredParams): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;

  if (slug === "new") {
    return {
      title: "New Category",
      description: "Create a new category for your application.",
    };
  }

  const category = await getCategoryBySlugAdmin(slug);

  return {
    title: category?.name,
    description: `Details for category: ${category?.name}`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategoriesAdmin();

  const staticPaths = [{ slug: "new" }];

  const dynamicPaths =
    categories?.map((category) => ({
      slug: category.slug,
    })) ?? [];

  return [...staticPaths, ...dynamicPaths];
}
