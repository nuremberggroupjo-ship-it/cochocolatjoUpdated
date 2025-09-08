import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"

import { getBannersAdminWithCount } from "@/data"

import type { Banner, Prisma } from "@/lib/_generated/prisma"

import {
  buildBasicWhere,
  createFetchEntitiesAction,
} from "@/features/admin/actions/create-fetch-entities"
import { BannersTable } from "@/features/admin/features/banners/components/banners-table"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const BannersPageWrapper: FC<WithRequiredSearchParams> = async (
  props,
) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    Banner,
    Prisma.BannerWhereInput,
    Prisma.BannerOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "banners",
      fetchFunction: getBannersAdminWithCount,
      buildWhere: buildBasicWhere,
    },
  })

  return <BannersTable promise={promise} />
}
