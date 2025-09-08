import { PropsWithChildren, Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { OrderSummary } from "@/features/checkout/components/order-summary"

/**
 * Checkout layout data component
 */
async function CheckoutLayoutData({ children }: PropsWithChildren) {
  // Get cart data for checkout
  const cartSummary = await getCheckoutCartData()

  // Validate cart before proceeding
  const validation = validateCartForCheckout(cartSummary)

  if (!validation.isValid) {
    return (
      <EmptyState
        title="Cannot proceed to checkout"
        description={validation.error || "Your cart is empty"}
        linkText="Continue Shopping"
        linkHref="/shop-now"
      />
    )
  }

  return (
    <main className="mx-auto my-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2">{children}</div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-[70px]">
            <OrderSummary
              cartSummary={cartSummary!}
              showItems={true}
              showPricing={true}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Checkout layout skeleton
 */
function CheckoutLayoutSkeleton() {
  return (
    <main className="mx-auto my-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Skeleton className="h-96" />
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-[70px]">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 *  Checkout layout component
 */
export default function CheckoutLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<CheckoutLayoutSkeleton />}>
      <CheckoutLayoutData>{children}</CheckoutLayoutData>
    </Suspense>
  )
}
