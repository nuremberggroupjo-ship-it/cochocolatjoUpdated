import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

interface HeroSectionSkeletonProps {
  length?: number
}

export const HeroSectionSkeleton: FC<HeroSectionSkeletonProps> = ({
  length = 4,
}) => {
  return (
    <section className="group/hero relative">
      <Skeleton className="flex aspect-[16/8] w-full items-center justify-center md:aspect-[16/5.5]">
        <div className="text-primary-foreground bg-primary/90 hover:bg-background hover:text-primary group-hover/hero:bg-primary p-2 text-base transition-all duration-200 md:p-3 md:text-lg lg:p-4 lg:text-2xl">
          Loading...
        </div>
      </Skeleton>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
        {Array.from({ length }, (_, i) => (
          <Skeleton
            key={i}
            className="cursor-not-allowed rounded-full bg-gray-300 p-1.5"
          />
        ))}
      </div>
    </section>
  )
}
