import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

export const RichEditorSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[80px] md:h-[45px]" />
      <Skeleton className="text-muted-foreground flex h-[156px] items-center justify-center">
        Loading editor...
      </Skeleton>
    </div>
  )
}
