import { FC, SVGProps } from "react"

import { ActionReturn } from "@/types"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { searchParamsCache } from "@/features/admin/lib/search-params-cache"

export type SidebarNavItem = {
  title: string
  href: string
  icon: FC<SVGProps<SVGSVGElement>>
  isActive?: boolean
  subItems?: {
    title: string
    href: string
  }[]
}

// Table
export type TableName = keyof typeof ADMIN_TABLE

export interface TablesProps<T> {
  promise: Promise<AdminFetchActionReturn<T>>
}

// actions
export type AdminFetchActionOptions = {
  search: Awaited<ReturnType<typeof searchParamsCache.parse>>
}

export type AdminFetchActionReturn<T> = ActionReturn<{
  data: T[]
  pageCount: number
}>
