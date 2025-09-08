import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"

import { getCategoriesAdminWithCount } from "@/data"

import type { Category, Prisma } from "@/lib/_generated/prisma"

import {
  buildBasicWhere,
  createFetchEntitiesAction,
} from "@/features/admin/actions/create-fetch-entities"
import { CategoriesTable } from "@/features/admin/features/categories/components/categories-table"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const CategoriesPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    Category,
    Prisma.CategoryWhereInput,
    Prisma.CategoryOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "categories",
      fetchFunction: getCategoriesAdminWithCount,
      buildWhere: buildBasicWhere,
    },
  })

  return <CategoriesTable promise={promise} />
}
