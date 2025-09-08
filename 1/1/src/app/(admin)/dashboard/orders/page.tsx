import { type Metadata } from "next"
import { Suspense } from "react"

import { type WithRequiredSearchParams } from "@/types"

import { Separator } from "@/components/ui/separator"

import { DataTableSkeleton } from "@/components/shared/data-table/components/data-table-skeleton"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { ADMIN_TABLE } from "@/features/admin/constants"
import { OrdersPageWrapper } from "@/features/admin/features/orders/components/orders-page-wrapper"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage customer orders and their status",
}

export default function OrdersPage(props: WithRequiredSearchParams) {
  const {
    heading: { title, description },
    skeleton: { columnsCount, cellWidths },
  } = ADMIN_TABLE.orders


  console.log("ADMIN_TABLE.orders: ",ADMIN_TABLE.orders);
  

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading title={title} description={description} />
      </div>
      <Separator className="bg-border/80" />
      <Suspense
        fallback={
          <DataTableSkeleton
            rowCount={7}
            columnCount={columnsCount}
            cellWidths={cellWidths}
            withCount={false}
            shrinkZero
          />
        }
      >
        <OrdersPageWrapper {...props} />
      </Suspense>
    </>
  )
}
