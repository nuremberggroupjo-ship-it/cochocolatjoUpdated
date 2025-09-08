import { FC } from "react"

import { cn } from "@/lib/utils"

import { Button, type ButtonProps } from "@/components/ui/button"

import { AppTooltip } from "@/components/shared/app-tooltip"

interface ButtonWithTooltipProps extends ButtonProps {
  tooltipContent?: string
  tooltipClassName?: string
  tooltipArrowClassName?: string
}

export const ButtonWithTooltip: FC<ButtonWithTooltipProps> = ({
  tooltipContent,
  tooltipClassName,
  tooltipArrowClassName,
  className,
  children,
  ...props
}) => {
  return (
    <AppTooltip
      className={tooltipClassName}
      arrowClassName={tooltipArrowClassName}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className={cn("cursor-pointer p-0", className)}
          {...props}
        >
          {children}
        </Button>
      }
    >
      {tooltipContent}
    </AppTooltip>
  )
}
