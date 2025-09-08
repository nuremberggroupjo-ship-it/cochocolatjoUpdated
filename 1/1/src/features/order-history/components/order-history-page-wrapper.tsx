import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"
import type { CustomerOrderData } from "@/types/db"

import { getCustomerOrdersWithCount } from "@/data"

import type { Prisma } from "@/lib/_generated/prisma"

import { createFetchEntitiesAction } from "@/features/admin/actions/create-fetch-entities/create-fetch-entities"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"
import { OrderHistoryTable } from "@/features/order-history/components/order-history-table"
import { buildOrderHistoryWhere } from "@/features/order-history/lib/build-order-history-where"

export const OrderHistoryPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    CustomerOrderData,
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "orders-history",
      fetchFunction: getCustomerOrdersWithCount,
      buildWhere: buildOrderHistoryWhere,
    },
  })

  return <OrderHistoryTable promise={promise} />
}
