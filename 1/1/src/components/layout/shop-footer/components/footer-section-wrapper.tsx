import { ComponentProps, FC } from "react"

import { cn } from "@/lib/utils"

interface FooterSectionWrapperProps extends ComponentProps<"div"> {
  title: string
}

export const FooterSectionWrapper: FC<FooterSectionWrapperProps> = ({
  title,
  children,
}) => {
  return (
    <div className="group/footer">
      <h2
        className={cn(
          "relative mb-4 inline-block text-base font-semibold",
          "after:bg-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-1/2 after:transition-all after:duration-300 group-hover/footer:after:w-full",
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
