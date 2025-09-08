import { FC } from "react"

import { Loader2Icon, type LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoaderProps extends LucideProps {
  wrapperClassName?: string
}

export const Loader: FC<LoaderProps> = ({
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        wrapperClassName,
      )}
    >
      <Loader2Icon
        className={cn("text-primary animate-spin", className)}
        {...props}
      />
    </div>
  )
}
