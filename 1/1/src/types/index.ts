import { ChangeEventHandler, FC, SVGProps } from "react"
import { deleteCategoryAction } from "@/features/admin/features/categories/actions/delete-category.action"

// Navigation / Social
export type ShopMainNavItem = {
  id: string
  label: string
  href: string
  comingSoon?: boolean
}

export type SocialLink = {
  id: string
  icon: FC<SVGProps<SVGSVGElement>>
  name: string
  href: string
}

// Form events
export type ChangeEventInputType =
  | ChangeEventHandler<HTMLInputElement>
  | undefined

// Page params / search
export type WithRequiredSearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type WithRequiredParams = {
  params: Promise<{ slug: string | string[] }>
}

export type WithRequiredIdParams = {
  params: Promise<{ id: string }>
}

export type WithRequiredOrderNumberParams = {
  params: Promise<{ orderNumber: string }>
}

// Actions
export interface ActionReturn<T = undefined> {
  success: boolean
  result?: T
  message?: string
}

// GET entities
export type GetEntitiesOptions<WhereInput, OrderByInput> = {
  limit?: number
  offset?: number
  where?: WhereInput
  orderBy?: OrderByInput[]
}

export type GetEntitiesResult<T> = {
  data: T[]
  total?: number
}

// DELETE action
export type DeleteSafeAction = typeof deleteCategoryAction

// Cart / Favorite info
export type FavoriteInfo = {
  isFavorite: boolean
}

export type CartInfo = {
  inCart: boolean
  quantity: number
  itemsPrice?: number
  totalPrice?: number
  shippingPrice?: number
}

// Sorting options
export type ProductsSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "alpha-asc"
  | "alpha-desc"

// Mail
export type MailDataState = {
  email: string
  message: string
}
