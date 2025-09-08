import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"

import { getAttributesAdminWithCount } from "@/data"

import type { Attribute, Prisma } from "@/lib/_generated/prisma"

import {
  buildBasicWhere,
  createFetchEntitiesAction,
} from "@/features/admin/actions/create-fetch-entities"
import { AttributesTable } from "@/features/admin/features/attributes/components/attributes-table"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const AttributesPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    Attribute,
    Prisma.AttributeWhereInput,
    Prisma.AttributeOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "attributes",
      fetchFunction: getAttributesAdminWithCount,
      buildWhere: buildBasicWhere,
    },
  })

  return <AttributesTable promise={promise} />
}
