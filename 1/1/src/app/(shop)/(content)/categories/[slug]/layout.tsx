import { Suspense } from "react"
import { CategoryLayoutWrapper } from "@/features/categories/components/category-layout-wrapper"
import { CategoryLayoutWrapperSkeleton } from "@/features/categories/skeletons/category-layout-wrapper-skeleton"

interface CategoryLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const promiseParams = Promise.resolve(params) // wrap into a Promise

  return (
    <Suspense fallback={<CategoryLayoutWrapperSkeleton />}>
      <CategoryLayoutWrapper params={promiseParams}>
        {children}
      </CategoryLayoutWrapper>
    </Suspense>
  )
}
