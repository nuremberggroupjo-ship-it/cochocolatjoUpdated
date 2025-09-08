import { ReactNode, Suspense } from "react"

import { CartSummarySkeleton } from "@/components/shared/skeletons/cart-skeletons"

import { CartSummary } from "@/features/cart/components/cart-summary"

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 space-y-5">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3">
        {/* Cart Summary - Shows first on mobile/tablet, right side on desktop */}
        <section className="order-1 lg:order-2 lg:col-span-1">
          <Suspense fallback={<CartSummarySkeleton />}>
            <CartSummary />
          </Suspense>
        </section>

        {/* Cart Items - Shows second on mobile/tablet, left side on desktop */}
        <section className="order-2 lg:order-1 lg:col-span-2">
          {children}
        </section>
      </div>
    </div>
  )
}
