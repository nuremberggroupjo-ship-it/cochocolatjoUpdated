import { FC, ReactNode } from "react"

import {
  getAttributesPublicWithProductCount,
  getCategoriesPublicWithProductCount,
} from "@/data"

import { FiltersLayout } from "./filter-layout"

interface ShopNowLayoutWrapperProps {
  children: ReactNode
}

export const ShopNowLayoutWrapper: FC<ShopNowLayoutWrapperProps> = async ({
  children,
}) => {
  const [categories, attributes] = await Promise.all([
    getCategoriesPublicWithProductCount(),
    getAttributesPublicWithProductCount(),
  ])

  if (!categories) {
    return null
  }

  return (
    <FiltersLayout categories={categories} attributes={attributes}>
      {children}
    </FiltersLayout>
  )
}
