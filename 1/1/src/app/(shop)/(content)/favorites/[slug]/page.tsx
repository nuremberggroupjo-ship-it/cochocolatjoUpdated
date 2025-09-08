import { type Metadata } from "next";
import { Suspense } from "react";

import { getProductBySlugPublic, getProductsPublic } from "@/data";

import { SingleProductPageWrapper } from "@/features/single-product/components";
import { SingleProductPageSkeleton } from "@/features/single-product/skeletons";

interface SingleProductPageProps {
  params: Promise<{ slug: string | string[] }>;
}

export default async function SingleProductPage({
  params,
}: SingleProductPageProps) {
  // Await the promise before accessing slug
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;

  return (
    <Suspense fallback={<SingleProductPageSkeleton />}>
      {/* Pass a Promise-wrapped params if the wrapper expects a Promise */}
      <SingleProductPageWrapper params={Promise.resolve({ slug })} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  const products = await getProductsPublic();

  return (
    products?.map((product) => ({
      slug: product.slug,
    })) ?? []
  );
}

export async function generateMetadata({
  params,
}: SingleProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;

  const product = await getProductBySlugPublic(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const { generateDynamicMetadata, createMetadata } = await import(
    "@/constants"
  );

  return createMetadata(
    generateDynamicMetadata.favoritesCategory({
      name: product.name,
      slug: product.slug,
    })
  );
}
