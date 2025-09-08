import { Metadata } from "next";
import { Suspense } from "react";

import type { WithRequiredParams } from "@/types";

import { getProductBySlugAdmin, getProductsAdmin } from "@/data";

import { ProductPageWrapper } from "@/features/admin/features/products/components/product-page-wrapper";
import { ProductPageWrapperSkeleton } from "@/features/admin/features/products/components/product-page-wrapper-skeleton";

export default function ProductPage({ params }: WithRequiredParams) {
  return (
    <Suspense fallback={<ProductPageWrapperSkeleton />}>
      <ProductPageWrapper params={params} />
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
      title: "New Product",
      description: "Create a new product for your application.",
    };
  }

  const product = await getProductBySlugAdmin(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product?.name,
    description: `Details for product: ${product?.name}`,
  };
}

export async function generateStaticParams() {
  const products = await getProductsAdmin();

  const staticPaths = [{ slug: "new" }];

  const dynamicPaths =
    products?.map((product) => ({
      slug: product.slug,
    })) ?? [];

  return [...staticPaths, ...dynamicPaths];
}
