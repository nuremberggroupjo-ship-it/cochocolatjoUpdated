import { FC } from "react"

import type { WithRequiredSearchParams } from "@/types"
import type { UserAdminData } from "@/types/db"

import { getUsersAdminWithCount } from "@/data"

import type { Prisma } from "@/lib/_generated/prisma"

import { createFetchEntitiesAction } from "@/features/admin/actions/create-fetch-entities"
import { UsersTable } from "@/features/admin/features/users/components/users-table"
import { buildUserWhere } from "@/features/admin/features/users/lib/build-user-where"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export const UsersPageWrapper: FC<WithRequiredSearchParams> = async (props) => {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const promise = createFetchEntitiesAction<
    UserAdminData,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput
  >({
    search,
    config: {
      entityName: "users",
      fetchFunction: getUsersAdminWithCount,
      buildWhere: buildUserWhere,
    },
  })

  return <UsersTable promise={promise} />
}
