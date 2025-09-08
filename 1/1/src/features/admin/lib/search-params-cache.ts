import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

import { ADMIN_PER_PAGE_OPTIONS } from "@/features/admin/constants"
import { getSortingStateParser } from "@/features/admin/lib/get-sorting-state-parser"

type Sort = {
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  slug: string
  isActive: boolean
  category: string
  orderNumber: string
}

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(ADMIN_PER_PAGE_OPTIONS[0]),
  sort: getSortingStateParser<Sort>().withDefault([
    { id: "updatedAt", desc: true },
  ]),
  name: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  orderNumber: parseAsString.withDefault(""),
})
