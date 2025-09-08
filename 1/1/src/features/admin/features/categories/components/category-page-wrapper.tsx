import { FC } from "react";

import type { WithRequiredParams } from "@/types";

import { getCategoryBySlugAdmin } from "@/data";

import { CategoryForm } from "@/features/admin/features/categories/components/category-form";
import { type SaveCategorySchema } from "@/features/admin/features/categories/lib/category.schema";

export const CategoryPageWrapper: FC<WithRequiredParams> = async ({ params }) => {
  // Await the params promise
  const resolvedParams = await params;

  // Normalize slug: if it's an array, take the first element
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug;

  const category = await getCategoryBySlugAdmin(slug);

  const defaultValues: SaveCategorySchema = {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    coverImage: category?.coverImage ?? "",
    thumbnailImage: category?.thumbnailImage ?? "",
    description: category?.description ?? "",
    isActive: category?.isActive ?? true,
    id: category?.id,
  };

  const isEditing = !!category;

  return <CategoryForm defaultValues={defaultValues} isEditing={isEditing} />;
};
