import { FC } from "react"

import { cn } from "@/lib/utils"

import { Skeleton } from "@/components/ui/skeleton"

import { SectionWrapper } from "@/features/home/components/section-wrapper"

interface CategoriesSkeletonProps {
  length?: number
  withoutTitle?: boolean
  className?: string
}

export const CategoriesSkeleton: FC<CategoriesSkeletonProps> = ({
  length = 7,
  withoutTitle = false,
  className = "",
}) => {
  const categoriesGrid = (
    <ul
      className={cn(
        "mx-auto mt-4 flex flex-wrap justify-center gap-4 md:mt-6 md:gap-6 lg:mt-8 lg:max-w-[90%] lg:gap-8",
        className,
      )}
    >
      {Array.from({ length }).map((_, index) => (
        <li
          className="border-border/50 flex h-48 w-[calc(50%-1rem)] flex-col items-center overflow-hidden rounded-xl border md:w-[calc(33.33%-1.5rem)] lg:w-[calc(25%-2rem)]"
          key={index}
        >
          <Skeleton className="size-full rounded-none" />
          <Skeleton className="my-2 h-8 w-36" />
        </li>
      ))}
    </ul>
  )

  if (withoutTitle) {
    return categoriesGrid
  }

  return <SectionWrapper title="Categories">{categoriesGrid}</SectionWrapper>
}
