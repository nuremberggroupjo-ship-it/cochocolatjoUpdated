import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"
import type { ProductData } from "@/types/db"

import { getProductsAdminWithCount } from "@/data"

import type { Prisma } from "@/lib/_generated/prisma"
import { convertToPlainObject } from "@/lib/utils"

import {
  buildProductOrderBy,
  createFetchEntitiesAction,
} from "@/features/admin/actions/create-fetch-entities"
import { ProductsTable } from "@/features/admin/features/products/components/products-table"
import { buildProductsWhere } from "@/features/admin/features/products/lib/build-products-where"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const ProductsPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    ProductData,
    Prisma.ProductWhereInput,
    Prisma.ProductOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "products",
      fetchFunction: getProductsAdminWithCount,
      buildWhere: buildProductsWhere,
      buildOrderBy: buildProductOrderBy,
      serializeData: (data) =>
        data.map((product) => convertToPlainObject(product)),
    },
  })

  return <ProductsTable promise={promise} />
}
