import { Metadata } from "next"
import { Suspense } from "react"

import { getAttributeBySlugAdmin, getAttributesAdmin } from "@/data"
import { AttributePageWrapper } from "@/features/admin/features/attributes/components/attribute-page-wrapper"
import { AttributePageWrapperSkeleton } from "@/features/admin/features/attributes/components/attribute-page-wrapper-skeleton"

interface AttributePageProps {
  // Accept params as a Promise from Next.js App Router
  params: Promise<{ slug: string }>
}

export default async function AttributePage({ params }: AttributePageProps) {
  const resolvedParams = await params

  return (
    <Suspense fallback={<AttributePageWrapperSkeleton />}>
      {/* Pass the resolved plain object, not a Promise */}
      <AttributePageWrapper params={resolvedParams} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: AttributePageProps): Promise<Metadata> {
  const { slug } = await params

  if (slug === "new") {
    return {
      title: "New Attribute",
      description: "Create a new attribute for your application.",
    }
  }

  const attribute = await getAttributeBySlugAdmin(slug)

  return {
    title: attribute?.name,
    description: `Details for attribute: ${attribute?.name}`,
  }
}

export async function generateStaticParams() {
  const attributes = await getAttributesAdmin()

  const staticPaths = [{ slug: "new" }]
  const dynamicPaths = attributes?.map((attribute) => ({ slug: attribute.slug })) ?? []

  return [...staticPaths, ...dynamicPaths]
}
