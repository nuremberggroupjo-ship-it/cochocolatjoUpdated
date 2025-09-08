// app/(shop)/(content)/categories/[slug]/page.tsx

import Categories from "./categories";
import type { ShopNowPageProps } from "../../../../../types/types";

export default async function Page({ params, searchParams }: ShopNowPageProps) {
  // Resolve both Promises
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Normalize slug
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;

  return <Categories slug={slug} searchParams={resolvedSearchParams} />;
}
