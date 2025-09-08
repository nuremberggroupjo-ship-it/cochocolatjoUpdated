import { notFound } from "next/navigation"

import { WithRequiredIdParams } from "@/types"

import { getOrderByIdAdmin } from "@/data"

import { Separator } from "@/components/ui/separator"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { OrderEditForm } from "@/features/admin/features/orders/components/order-edit-form"
import { OrderInfoDisplay } from "@/features/admin/features/orders/components/order-info-display"

export const OrderPageWrapper = async ({ params }: WithRequiredIdParams) => {
  const { id } = await params

  const order = await getOrderByIdAdmin(id)

  if (!order) {
    notFound()
  }

  return (
    <>
      <AdminHeading
        title="Edit Order"
        description={`Manage order details for "${order.orderNumber}"`}
      />

      <Separator />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Information */}
        <div className="space-y-6">
          <OrderInfoDisplay order={order} />
        </div>

        {/* Order Edit Form */}
        <div className="space-y-6">
          <OrderEditForm order={order} />
        </div>
      </div>
    </>
  )
}
