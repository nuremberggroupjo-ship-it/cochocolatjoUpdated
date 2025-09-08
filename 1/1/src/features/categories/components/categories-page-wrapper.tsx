import { FC } from "react"

import { getCategoriesPublic } from "@/data"

import { CategoryItem } from "@/features/home/components/category-item"

export const CategoriesPageWrapper: FC = async () => {
  const categories = await getCategoriesPublic()

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <ul className="mx-auto mt-4 mb-6 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
      {categories.map((category) => (
        <CategoryItem key={category.id} {...category} />
      ))}
    </ul>
  )
}
