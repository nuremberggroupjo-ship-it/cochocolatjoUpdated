// src/features/admin/actions/fetch-entities.action.ts
import { GetEntitiesOptions, GetEntitiesResult } from "@/types"

import { verifySession } from "@/lib/dal"

import {
  AdminFetchActionOptions,
  AdminFetchActionReturn,
} from "@/features/admin/types"

type CreateFetchEntityFunction<T, WhereInput, OrderByInput> = (
  options: GetEntitiesOptions<WhereInput, OrderByInput>,
) => Promise<GetEntitiesResult<T>>

type BuildWhereFunction<WhereInput> = (
  search: AdminFetchActionOptions["search"],
  userId?: string,
) => WhereInput

type BuildOrderByFunction<OrderByInput> = (
  search: AdminFetchActionOptions["search"],
) => OrderByInput[]

type CreateFetchEntitiesConfig<T, WhereInput, OrderByInput> = {
  entityName:
    | "attributes"
    | "products"
    | "categories"
    | "banners"
    | "users"
    | "orders"
    | "orders-history"
  fetchFunction: CreateFetchEntityFunction<T, WhereInput, OrderByInput>
  buildWhere: BuildWhereFunction<WhereInput>
  buildOrderBy?: BuildOrderByFunction<OrderByInput>
  defaultOrderBy?: OrderByInput[]
  serializeData?: (data: T[]) => T[]
}

// ✅ Smart default function
function getSmartDefaultOrderBy<OrderByInput>(): OrderByInput[] {
  return [{ updatedAt: "desc" }, { id: "asc" }] as OrderByInput[]
}

export async function createFetchEntitiesAction<T, WhereInput, OrderByInput>({
  search,
  config,
}: AdminFetchActionOptions & {
  config: CreateFetchEntitiesConfig<T, WhereInput, OrderByInput>
}): Promise<AdminFetchActionReturn<T>> {
  const { user } = await verifySession({
    isAdmin: config.entityName === "orders-history" ? false : true,
  })

  try {
    const offset = (search.page - 1) * search.perPage

    // Build where condition using provided function
    const where = config.buildWhere(search, user.id)

    // ✅ Use smart default if no defaultOrderBy provided
    let orderBy: OrderByInput[] =
      config.defaultOrderBy ?? getSmartDefaultOrderBy<OrderByInput>()

    if (search.sort.length > 0) {
      if (config.buildOrderBy) {
        orderBy = config.buildOrderBy(search)
      } else {
        // Generic orderBy handling
        orderBy = search.sort.map((item) => ({
          [item.id]: item.desc ? "desc" : "asc",
        })) as OrderByInput[]
      }
    }

    // Fetch data using the provided function
    const { data, total } = await config.fetchFunction({
      where,
      orderBy,
      offset,
      limit: search.perPage,
    })

    // Serialize data if function provided
    const serializedData = config.serializeData
      ? config.serializeData(data)
      : data

    const pageCount = Math.ceil((total || 0) / search.perPage)

    return {
      success: true,
      result: {
        data: serializedData,
        pageCount,
      },
      message: "Success",
    }
  } catch (error) {
    console.error(`Error fetching ${config.entityName}:`, error)
    return {
      success: false,
      result: { data: [], pageCount: 0 },
      message:
        error instanceof Error
          ? error.message
          : `Failed to fetch ${config.entityName}`,
    }
  }
}
