import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

export const PaginationSkeleton: FC = () => {
  return (
    <div className="flex justify-center gap-x-2">
      <Skeleton className="h-10 w-18" />
      <Skeleton className="hidden h-10 w-10 md:block" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="hidden h-10 w-10 md:block" />
      <Skeleton className="h-10 w-18" />
    </div>
  )
}
