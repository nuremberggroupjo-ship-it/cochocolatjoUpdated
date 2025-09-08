import Link from "next/link"
import { FC } from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  linkText?: string
  linkHref?: string
  className?: string
}

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  linkText,
  linkHref,
  className,
}) => {
  return (
    <div className={cn("py-4 text-center sm:py-8", className)}>
      <h3 className="mb-3 text-base font-semibold sm:text-lg">{title}</h3>

      <p className="text-muted-foreground/80 mb-4 text-xs sm:text-sm md:mb-6 md:text-base">
        {description}
      </p>

      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="text-primary text-sm font-medium transition-colors hover:underline md:text-base"
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}
