import { ReactNode, Suspense } from "react"

import { ShopNowLayoutWrapper } from "@/features/shop-now/components/shop-now-layout-wrapper"
import { ShopNowLayoutWrapperSkeleton } from "@/features/shop-now/skeletons"

export default function ShopNowLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ShopNowLayoutWrapperSkeleton />}>
      <ShopNowLayoutWrapper>{children}</ShopNowLayoutWrapper>
    </Suspense>
  )
}
