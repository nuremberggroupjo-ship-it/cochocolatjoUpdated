import { type Metadata } from "next"
import { Suspense } from "react"

import { WithRequiredParams } from "@/types"

import { getBannerBySlugAdmin, getBannersAdmin } from "@/data"

import { BannerPageWrapper } from "@/features/admin/features/banners/components/banner-page-wrapper"
import { BannerPageWrapperSkeleton } from "@/features/admin/features/banners/components/banner-page-wrapper-skeleton"

export default async function BannerPage({ params }: WithRequiredParams) {
  const resolvedParams = await params

  // Normalize slug to always be a string
  const slug =
    Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug

  return (
    <Suspense fallback={<BannerPageWrapperSkeleton />}>
      {/* Wrap in Promise.resolve to match type */}
      <BannerPageWrapper params={Promise.resolve({ slug })} />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
}: WithRequiredParams): Promise<Metadata> {
  const resolvedParams = await params

  const slug =
    Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug

  if (slug === "new") {
    return {
      title: "New Banner",
      description: "Create a new banner for your application.",
    }
  }

  const banner = await getBannerBySlugAdmin(slug)

  return {
    title: banner?.name,
    description: `Details for banner: ${banner?.name}`,
  }
}

export async function generateStaticParams() {
  const banners = await getBannersAdmin()

  const staticPaths = [{ slug: "new" }]
  const dynamicPaths = banners?.map((banner) => ({ slug: banner.slug })) ?? []

  return [...staticPaths, ...dynamicPaths]
}
