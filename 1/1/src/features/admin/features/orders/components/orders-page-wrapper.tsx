import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"
import type { OrderTableData } from "@/types/db"

import { getOrdersAdminWithCount } from "@/data"

import type { Prisma } from "@/lib/_generated/prisma"

import { createFetchEntitiesAction } from "@/features/admin/actions/create-fetch-entities"
import { OrdersTable } from "@/features/admin/features/orders/components/orders-table"
import { buildOrderWhere } from "@/features/admin/features/orders/lib/build-order-where"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const OrdersPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  // Create the promise for orders data with proper typing
  const promise = createFetchEntitiesAction<
    OrderTableData,
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "orders",
      fetchFunction: getOrdersAdminWithCount,
      buildWhere: buildOrderWhere,
    },
  })

  return <OrdersTable promise={promise} />
}
