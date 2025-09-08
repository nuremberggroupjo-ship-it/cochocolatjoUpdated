import { ComponentProps, FC } from "react"

import { cn } from "@/lib/utils"

interface SectionWrapperProps extends ComponentProps<"section"> {
  title: string
}

export const SectionWrapper: FC<SectionWrapperProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <section className={cn("mt-4 md:mt-8 lg:mt-12", className)} {...props}>
      <h2
        className={cn(
          "relative py-4 text-center",
          "before:bg-primary/50 before:absolute before:top-1/2 before:right-0 before:left-0 before:h-0.5 before:-translate-y-1/2 before:content-['']",
        )}
      >
        <span className="bg-background relative z-20 px-6 font-bold tracking-wide uppercase md:px-16 md:text-xl lg:px-30 lg:text-2xl">
          {title}
        </span>
      </h2>
      {children}
    </section>
  )
}
