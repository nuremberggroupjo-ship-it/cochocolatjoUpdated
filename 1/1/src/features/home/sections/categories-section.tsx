import { FC } from "react"

import { getCategoriesPublic } from "@/data"

import { CategoryItem } from "@/features/home/components/category-item"
import { SectionWrapper } from "@/features/home/components/section-wrapper"

export const CategoriesSection: FC = async () => {
  const categories = await getCategoriesPublic()

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <SectionWrapper title="Categories" id="categories">
      <ul className="mx-auto mt-4 flex flex-wrap justify-center gap-4 md:mt-6 md:gap-6 lg:mt-8 lg:max-w-[90%] lg:gap-8">
        {categories.map((category) => (
          <CategoryItem key={category.id} {...category} />
        ))}
      </ul>
    </SectionWrapper>
  )
}
