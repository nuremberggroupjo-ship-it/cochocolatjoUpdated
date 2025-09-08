import { type Metadata } from "next"
import { Suspense } from "react"

import { WithRequiredSearchParams } from "@/types"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { DataTableSkeleton } from "@/components/shared/data-table/components/data-table-skeleton"

import { OrderHistoryPageWrapper } from "@/features/order-history/components/order-history-page-wrapper"
import { CUSTOMER_ORDER_HISTORY } from "@/features/order-history/constants"

export const metadata: Metadata = createMetadata(PAGE_METADATA.orderHistory)

export default function OrderHistoryPage(props: WithRequiredSearchParams) {
  const {
    skeleton: { columnsCount, cellWidths },
  } = CUSTOMER_ORDER_HISTORY

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          className="mt-4"
          rowCount={7}
          withCount={false}
          columnCount={columnsCount}
          cellWidths={cellWidths}
          shrinkZero
        />
      }
    >
      <OrderHistoryPageWrapper searchParams={props.searchParams} />
    </Suspense>
  )
}
