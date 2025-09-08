import { FC } from "react";

import type { WithRequiredParams } from "@/types";

import {
  getAttributesAdmin,
  getCategoriesAdmin,
  getProductBySlugAdmin,
} from "@/data";

import { ProductForm } from "@/features/admin/features/products/components/product-form";
import { type SaveProductSchema } from "@/features/admin/features/products/lib/product.schema";

export const ProductPageWrapper: FC<WithRequiredParams> = async ({ params }) => {
  // Await the params promise
  const resolvedParams = await params;

  // Normalize slug: if it's an array, take the first element
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug;

  const [product, categories, attributes] = await Promise.all([
    getProductBySlugAdmin(slug),
    getCategoriesAdmin(),
    getAttributesAdmin(),
  ]);

  const defaultValues: SaveProductSchema = {
    id: product?.id,
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    ingredients: product?.ingredients ?? "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    stock: product?.stock ?? 0,
    price: product?.price ? Number(product.price) : 0,
    discountPrice: product?.discountPrice ? Number(product.discountPrice) : null,
    isDiscountActive: product?.isDiscountActive ?? false,
    images:
      product?.productImages.map((productImage) => ({
        id: productImage.id,
        url: productImage.imageUrl,
      })) ?? [],
    isFeatured: product?.isFeatured ?? false,
    isActive: product?.isActive ?? true,
    categoryId: product?.category.id ?? "",
    attributes: product?.attributes.map((attr) => attr.attribute.id) ?? [],
  };

  const isEditing = !!product;

  return (
    <ProductForm
      defaultValues={defaultValues}
      isEditing={isEditing}
      categories={categories}
      attributes={attributes}
    />
  );
};
